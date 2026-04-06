import csv
import io
import threading
import traceback
from urllib.parse import quote
from django.conf import settings
from django.core.mail import EmailMessage, get_connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ExamInvitation, Question, ExamSubmission

# --- Helper Functions ---

def get_email_connection():
    """Get email connection based on configured backend"""
    if 'console' in settings.EMAIL_BACKEND.lower():
        # Console backend - no connection needed
        return get_connection()
    elif 'locmem' in settings.EMAIL_BACKEND.lower():
        # In-memory backend for testing
        return get_connection()
    else:
        # SMTP backend
        return get_connection(
            backend=settings.EMAIL_BACKEND,
            host=settings.EMAIL_HOST,
            port=settings.EMAIL_PORT,
            username=settings.EMAIL_HOST_USER,
            password=settings.EMAIL_HOST_PASSWORD,
            use_tls=settings.EMAIL_USE_TLS,
            use_ssl=settings.EMAIL_USE_SSL,
            timeout=settings.EMAIL_TIMEOUT,
        )

def send_single_email_task(invitation_id, student_name, student_email, course_title):
    """
    Sends email in a separate thread.
    """
    try:
        exam_link = (
            f"https://digital-certificate-issue.vercel.app/auth-exam"
            f"?name={quote(student_name)}"
            f"&email={quote(student_email)}"
            f"&course={quote(course_title)}"
        )

        subject = f"Exam Link for {course_title}"
        message = f"""Hello {student_name},

You have been invited to take the exam for the course: {course_title}.

Click the link below to start your exam:
{exam_link}

Regards,
Admin
"""
        # Use default connection (respects EMAIL_BACKEND setting)
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[student_email],
        )
        email.send(fail_silently=False)
        
        ExamInvitation.objects.filter(id=invitation_id).update(status="Sent")
        print(f"SUCCESS: Email sent to {student_email}")

    except Exception as e:
        print(f"FAILED: Email to {student_email}. Error: {str(e)}")
        traceback.print_exc()
        ExamInvitation.objects.filter(id=invitation_id).update(status="Failed")

def send_bulk_emails_task(course_title, csv_data_str):
    csv_reader = csv.DictReader(io.StringIO(csv_data_str))
    for row in csv_reader:
        student_name = row.get('student_name', '').strip() or row.get('name', '').strip()
        student_email = row.get('student_email', '').strip() or row.get('email', '').strip()
        
        if not student_name or not student_email: 
            continue
        
        try:
            exam_link = (
                f"https://digital-certificate-issue.vercel.app/auth-exam"
                f"?name={quote(student_name)}"
                f"&email={quote(student_email)}"
                f"&course={quote(course_title)}"
            )
            invitation = ExamInvitation.objects.create(
                student_name=student_name, 
                student_email=student_email,
                course_title=course_title, 
                exam_link=exam_link, 
                status="Pending"
            )
            
            msg = f"Hello {student_name},\n\nLink: {exam_link}\n\nRegards, Admin"
            email = EmailMessage(f"Exam: {course_title}", msg, settings.DEFAULT_FROM_EMAIL, [student_email])
            email.send(fail_silently=False)
            
            invitation.status = "Sent"
            invitation.save()
        except Exception as e:
            print(f"BULK ERROR: {str(e)}")
            traceback.print_exc()

# --- API Views ---

@api_view(["POST"])
def send_exam_mail(request):
    try:
        # 1. Get Data
        student_name = request.data.get("student_name") or request.data.get("name")
        student_email = request.data.get("student_email") or request.data.get("email")
        course_title = request.data.get("course_title")

        # 2. Validate
        if not student_name or not student_email or not course_title:
            return Response({"error": "Missing fields: name, email, or course"}, status=400)

        # 3. Prepare Link
        exam_link = (
            f"https://digital-certificate-issue.vercel.app/auth-exam"
            f"?name={quote(student_name)}"
            f"&email={quote(student_email)}"
            f"&course={quote(course_title)}"
        )

        # 4. Save to DB (Try/Except specifically for DB issues)
        try:
            invitation = ExamInvitation.objects.create(
                student_name=student_name,
                student_email=student_email,
                course_title=course_title,
                exam_link=exam_link,
                status="Pending"
            )
        except Exception as db_error:
            # If DB fails, return immediately with details
            return Response({"error": f"Database save failed: {str(db_error)}"}, status=500)

        # 5. Start Background Thread
        thread = threading.Thread(
            target=send_single_email_task,
            args=(invitation.id, student_name, student_email, course_title)
        )
        thread.daemon = True
        thread.start()

        # 6. Return Success immediately
        return Response({"message": "Invitation saved. Email sending in background.", "mail_sent": True}, status=200)

    except Exception as e:
        # This catches the 500 error and tells you what happened
        print("CRITICAL ERROR in send_exam_mail:", traceback.format_exc())
        return Response({"error": f"Server Crash: {str(e)}"}, status=500)


@api_view(["POST"])
def send_exam_mail_bulk(request):
    try:
        course_title = request.data.get("course_title")
        csv_file = request.FILES.get("file")

        if not course_title or not csv_file:
            return Response({"error": "Course and file required"}, status=400)

        csv_data = csv_file.read().decode('utf-8')
        
        thread = threading.Thread(target=send_bulk_emails_task, args=(course_title, csv_data))
        thread.daemon = True
        thread.start()

        return Response({"message": "Bulk processing started."}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def completed_tests(request):
    try:
        submissions = ExamSubmission.objects.filter(status="Completed").order_by('-submitted_at')
        data = []
        for s in submissions:
            data.append({
                "id": s.id, "student_name": s.student_name, "student_email": s.student_email,
                "course_title": s.course_title, "score": s.score, "result": s.result,
                "status": s.status, "submitted_at": s.submitted_at,
            })
        return Response(data, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
def submit_exam(request):
    try:
        student_name = request.data.get("student_name")
        student_email = request.data.get("student_email")
        course_title = request.data.get("course_title")
        score = request.data.get("score")
        total_questions = request.data.get("total_questions")
        result = request.data.get("result")
        started_at = request.data.get("started_at")

        if not all([student_name, student_email, course_title, score is not None, total_questions, result]):
            return Response({"error": "All fields required"}, status=400)

        submission = ExamSubmission.objects.create(
            student_name=student_name, student_email=student_email, course_title=course_title,
            score=score, total_questions=total_questions, result=result,
            eligible_for_certificate=(result == "Passed"), status="Completed", started_at=started_at
        )
        return Response({"message": "Submitted", "id": submission.id}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
def update_exam_status(request):
    try:
        submission_id = request.data.get("submission_id")
        status_val = request.data.get("status")
        sub = ExamSubmission.objects.get(id=submission_id)
        sub.status = status_val
        sub.save()
        return Response({"message": "Updated"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
def get_questions(request, course_title):
    try:
        questions = Question.objects.filter(course_title=course_title)
        data = [{"id": q.id, "question_text": q.question_text, "option1": q.option1, "option2": q.option2, "option3": q.option3, "option4": q.option4, "correct_answer": q.correct_answer} for q in questions]
        return Response(data, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
def test_email_config(request):
    try:
        conn = get_email_connection()
        conn.open()
        conn.close()
        return Response({"status": "ok"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)