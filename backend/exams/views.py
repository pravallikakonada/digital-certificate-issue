from urllib.parse import quote
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ExamInvitation, Question, ExamSubmission
import csv
import io


@api_view(["POST"])
def send_exam_mail(request):
    student_name = request.data.get("student_name") or request.data.get("name")
    student_email = request.data.get("student_email") or request.data.get("email")
    course_title = request.data.get("course_title")

    if not student_name or not student_email or not course_title:
        return Response({"error": "All fields are required"}, status=400)

    exam_link = (
        f"https://digital-certificate-issue.vercel.app/auth-exam"
        f"?name={quote(student_name)}"
        f"&email={quote(student_email)}"
        f"&course={quote(course_title)}"
    )

    try:
        ExamInvitation.objects.create(
            student_name=student_name,
            student_email=student_email,
            course_title=course_title,
            exam_link=exam_link,
            status="Sent"
        )
    except Exception as e:
        print("EXAM INVITATION SAVE ERROR:", str(e))
        return Response({"error": f"Save failed: {str(e)}"}, status=500)

    try:
        subject = f"Exam Link for {course_title}"
        message = f"""Hello {student_name},

You have been invited to take the exam for the course: {course_title}.

Click the link below to start your exam:
{exam_link}

Regards,
Admin
"""

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[student_email],
            fail_silently=False,
        )

        return Response(
            {"message": "Exam mail sent successfully ", "mail_sent": True},
            status=200
        )

    except Exception as e:
        print("SEND EXAM MAIL ERROR:", str(e))
        return Response(
            {"error": f"Invitation saved but mail not sent: {str(e)}"},
            status=500
        )


@api_view(["POST"])
def send_exam_mail_bulk(request):
    course_title = request.data.get("course_title")
    csv_file = request.FILES.get("file")

    if not course_title:
        return Response({"error": "Course title is required"}, status=400)

    if not csv_file:
        return Response({"error": "CSV file is required"}, status=400)

    if not csv_file.name.endswith('.csv'):
        return Response({"error": "File must be a CSV"}, status=400)

    try:
        # Read CSV file
        csv_data = csv_file.read().decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(csv_data))

        sent_count = 0
        failed_count = 0
        errors = []

        for row_num, row in enumerate(csv_reader, start=2):  # Start at 2 because row 1 is header
            student_name = row.get('student_name', '').strip() or row.get('name', '').strip()
            student_email = row.get('student_email', '').strip() or row.get('email', '').strip()

            if not student_name or not student_email:
                errors.append(f"Row {row_num}: Missing student_name or student_email")
                failed_count += 1
                continue

            exam_link = (
                f"https://digital-certificate-issue.vercel.app/auth-exam"
                f"?name={quote(student_name)}"
                f"&email={quote(student_email)}"
                f"&course={quote(course_title)}"
            )

            try:
                # Save invitation
                ExamInvitation.objects.create(
                    student_name=student_name,
                    student_email=student_email,
                    course_title=course_title,
                    exam_link=exam_link,
                    status="Sent"
                )

                # Send email
                subject = f"Exam Link for {course_title}"
                message = f"""Hello {student_name},

You have been invited to take the exam for the course: {course_title}.

Click the link below to start your exam:
{exam_link}

Regards,
Admin
"""

                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[student_email],
                    fail_silently=False,
                )

                sent_count += 1
                print(f"Email sent to {student_email}")

            except Exception as e:
                print(f"Failed to send email to {student_email}: {str(e)}")
                errors.append(f"Row {row_num} ({student_email}): {str(e)}")
                failed_count += 1

        return Response({
            "message": f"Bulk exam mails processed. Sent: {sent_count}, Failed: {failed_count}",
            "sent_count": sent_count,
            "failed_count": failed_count,
            "errors": errors[:10]  # Limit errors to first 10
        }, status=200)

    except Exception as e:
        print("BULK SEND EXAM MAIL ERROR:", str(e))
        return Response(
            {"error": f"Bulk send failed: {str(e)}"},
            status=500
        )


@api_view(["GET"])
def completed_tests(request):
    try:
        # Get completed submissions that have corresponding exam invitations (students who were invited via email)
        submissions = ExamSubmission.objects.filter(
            status="Completed",
            student_email__in=ExamInvitation.objects.values_list('student_email', flat=True)
        ).order_by('-submitted_at')

        data = []

        for submission in submissions:
            data.append({
                "id": submission.id,
                "student_name": submission.student_name,
                "student_email": submission.student_email,
                "course_title": submission.course_title,
                "score": submission.score,
                "total_questions": submission.total_questions,
                "result": submission.result,
                "eligible_for_certificate": submission.eligible_for_certificate,
                "status": submission.status,
                "started_at": submission.started_at,
                "submitted_at": submission.submitted_at,
            })

        return Response(data, status=200)

    except Exception as e:
        print("COMPLETED TESTS ERROR:", str(e))
        return Response({"error": f"Failed to fetch completed tests: {str(e)}"}, status=500)


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
            return Response({"error": "All fields are required"}, status=400)

        # Determine eligibility for certificate
        eligible_for_certificate = result == "Passed"

        # Create the submission
        submission = ExamSubmission.objects.create(
            student_name=student_name,
            student_email=student_email,
            course_title=course_title,
            score=score,
            total_questions=total_questions,
            result=result,
            eligible_for_certificate=eligible_for_certificate,
            status="Completed",
            started_at=started_at
        )

        return Response({
            "message": "Exam submitted successfully",
            "submission_id": submission.id
        }, status=201)

    except Exception as e:
        print("SUBMIT EXAM ERROR:", str(e))
        return Response({"error": f"Failed to submit exam: {str(e)}"}, status=500)


@api_view(["POST"])
def update_exam_status(request):
    try:
        submission_id = request.data.get("submission_id")
        status = request.data.get("status")

        if not submission_id or not status:
            return Response({"error": "submission_id and status are required"}, status=400)

        try:
            submission = ExamSubmission.objects.get(id=submission_id)
            submission.status = status
            submission.save()

            return Response({
                "message": f"Exam status updated to {status}",
                "submission_id": submission.id
            }, status=200)

        except ExamSubmission.DoesNotExist:
            return Response({"error": "Exam submission not found"}, status=404)

    except Exception as e:
        print("UPDATE EXAM STATUS ERROR:", str(e))
        return Response({"error": f"Failed to update exam status: {str(e)}"}, status=500)


@api_view(["GET"])
def get_questions(request, course_title):
    try:
        questions = Question.objects.filter(course_title=course_title)
        data = []

        for question in questions:
            data.append({
                "id": question.id,
                "question_text": question.question_text,
                "option1": question.option1,
                "option2": question.option2,
                "option3": question.option3,
                "option4": question.option4,
                "correct_answer": question.correct_answer,
            })

        return Response(data, status=200)

    except Exception as e:
        print("GET QUESTIONS ERROR:", str(e))
        return Response({"error": f"Failed to fetch questions: {str(e)}"}, status=500)