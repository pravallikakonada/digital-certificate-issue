import csv
import io
import traceback
import smtplib
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
            f"{settings.FRONTEND_URL}/auth-exam"
            f"?name={quote(student_name)}"
            f"&email={quote(student_email)}"
            f"&course={quote(course_title)}"
        )

        # 4. Try to send email first
        email_sent = False
        email_error_msg = ""
        
        try:
            subject = f"Exam Invitation: {course_title}"
            message = f"""Dear {student_name},

You have been invited to take the examination for the course: {course_title}.

Please click the link below to access your exam:

{exam_link}

Important Instructions:
- Make sure you have a stable internet connection
- Complete the exam in one sitting
- Do not refresh the page during the exam
- Your progress will be automatically saved

If you have any questions, please contact your instructor.

Best regards,
Exam Administration Team
Digital Certificate System
"""
            email = EmailMessage(
                subject=subject,
                body=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[student_email],
            )
            # Add headers to improve deliverability
            email.extra_headers = {
                'Reply-To': settings.DEFAULT_FROM_EMAIL,
                'X-Mailer': 'Django Email System',
                'X-Priority': '1',
                'Importance': 'high',
                'Return-Path': settings.DEFAULT_FROM_EMAIL,
            }
            print(f"[EMAIL LOG] Attempting to send email to {student_email}")
            print(f"[EMAIL CONFIG] Backend: {settings.EMAIL_BACKEND}")
            print(f"[EMAIL CONFIG] Host: {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
            
            email.send(fail_silently=False)
            print(f"[SUCCESS] Email sent to {student_email}")
            email_sent = True

        except smtplib.SMTPAuthenticationError as auth_error:
            email_error_msg = "Gmail authentication failed. Check your email/password or app password."
            print(f"[AUTH ERROR] {email_error_msg}: {str(auth_error)}")
            
        except smtplib.SMTPException as smtp_error:
            email_error_msg = f"SMTP Error: {str(smtp_error)}"
            print(f"[SMTP ERROR] {email_error_msg}")
            
        except Exception as email_error:
            email_error_msg = str(email_error)
            print(f"[ERROR] Email to {student_email} failed: {email_error_msg}")
            print("[TRACEBACK]", traceback.format_exc())

        # 5. Save to DB if email was sent OR show error
        if not email_sent:
            return Response({
                "error": email_error_msg or "Failed to send email. Check backend logs.",
                "details": {
                    "email_backend": settings.EMAIL_BACKEND,
                    "email_host": settings.EMAIL_HOST,
                    "email_port": settings.EMAIL_PORT,
                }
            }, status=500)

        try:
            invitation = ExamInvitation.objects.create(
                student_name=student_name,
                student_email=student_email,
                course_title=course_title,
                exam_link=exam_link,
                status="Sent"
            )
        except Exception as db_error:
            # Email was sent but DB failed - still return success since email went out
            print(f"[WARNING] Email sent but DB save failed: {str(db_error)}")
            return Response({
                "message": "Email sent successfully ✅ (database save had a minor issue)",
                "mail_sent": True
            }, status=200)

        # 6. Return Success
        return Response({"message": "Exam mail sent successfully ✅", "mail_sent": True}, status=200)

    except Exception as e:
        print("[CRITICAL ERROR] in send_exam_mail:", str(e))
        print("[TRACEBACK]", traceback.format_exc())
        return Response({"error": f"Server error: {str(e)}"}, status=500)


@api_view(["POST"])
def send_exam_mail_bulk(request):
    try:
        course_title = request.data.get("course_title")
        csv_file = request.FILES.get("file")

        if not course_title or not csv_file:
            return Response({"error": "Course and file required"}, status=400)

        csv_data = csv_file.read().decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(csv_data))

        sent_count = 0
        failed_count = 0
        errors = []

        for row in csv_reader:
            student_name = row.get('student_name', '').strip() or row.get('name', '').strip()
            student_email = row.get('student_email', '').strip() or row.get('email', '').strip()

            if not student_name or not student_email:
                failed_count += 1
                errors.append(f"Missing name or email in row")
                continue

            try:
                exam_link = (
                    f"{settings.FRONTEND_URL}/auth-exam"
                    f"?name={quote(student_name)}"
                    f"&email={quote(student_email)}"
                    f"&course={quote(course_title)}"
                )

                msg = f"""Dear {student_name},

You have been invited to take the examination for the course: {course_title}.

Please click the link below to access your exam:

{exam_link}

Important Instructions:
- Make sure you have a stable internet connection
- Complete the exam in one sitting
- Do not refresh the page during the exam
- Your progress will be automatically saved

If you have any questions, please contact your instructor.

Best regards,
Exam Administration Team
Digital Certificate System
"""

                email = EmailMessage(f"Exam Link for {course_title}", msg, settings.DEFAULT_FROM_EMAIL, [student_email])
                # Add headers to improve deliverability
                email.extra_headers = {
                    'Reply-To': settings.DEFAULT_FROM_EMAIL,
                    'X-Mailer': 'Django Email System',
                    'X-Priority': '1',
                    'Importance': 'high',
                    'Return-Path': settings.DEFAULT_FROM_EMAIL,
                }
                email.send(fail_silently=False)

                # Save to DB
                ExamInvitation.objects.create(
                    student_name=student_name,
                    student_email=student_email,
                    course_title=course_title,
                    exam_link=exam_link,
                    status="Sent"
                )

                sent_count += 1
                print(f"[BULK SUCCESS] Email sent to {student_email}")

            except smtplib.SMTPAuthenticationError as auth_error:
                failed_count += 1
                error_msg = f"Auth failed to {student_email}"
                errors.append(error_msg)
                print(f"[BULK AUTH ERROR] {error_msg}")
                
            except Exception as e:
                failed_count += 1
                error_msg = f"Failed to send to {student_email}: {str(e)[:50]}"
                errors.append(error_msg)
                print(f"[BULK ERROR] {error_msg}")

        message = f"Bulk email sending completed. Sent: {sent_count}, Failed: {failed_count}"
        if errors:
            message += f". Errors: {'; '.join(errors[:3])}"  # Show first 3 errors

        return Response({"message": message, "sent": sent_count, "failed": failed_count}, status=200)

    except Exception as e:
        print(f"[BULK CRITICAL ERROR] {str(e)}")
        print("[TRACEBACK]", traceback.format_exc())
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
                "eligible_for_certificate": s.eligible_for_certificate,
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
    """Test email configuration by checking connection settings"""
    try:
        config_info = {
            "email_backend": settings.EMAIL_BACKEND,
            "email_host": settings.EMAIL_HOST,
            "email_port": settings.EMAIL_PORT,
            "email_use_tls": settings.EMAIL_USE_TLS,
            "email_use_ssl": settings.EMAIL_USE_SSL,
            "from_email": settings.DEFAULT_FROM_EMAIL,
            "frontend_url": settings.FRONTEND_URL,
            "user_configured": bool(settings.EMAIL_HOST_USER),
        }
        
        # Try to open a connection
        try:
            print("[TEST] Attempting to open SMTP connection...")
            conn = get_email_connection()
            conn.open()
            print("[TEST] SMTP connection successful!")
            conn.close()
            config_info["connection_status"] = "SUCCESS ✅"
            return Response(config_info, status=200)
        except smtplib.SMTPAuthenticationError as e:
            print(f"[TEST] SMTP Auth Error: {str(e)}")
            config_info["connection_status"] = f"AUTH FAILED - Check email/password"
            config_info["error"] = str(e)
            return Response(config_info, status=500)
        except Exception as conn_error:
            print(f"[TEST] Connection Error: {str(conn_error)}")
            config_info["connection_status"] = f"CONNECTION FAILED"
            config_info["error"] = str(conn_error)
            return Response(config_info, status=500)
            
    except Exception as e:
        print(f"[TEST] Error: {str(e)}")
        return Response({"error": str(e), "status": "failed"}, status=500)