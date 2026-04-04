from urllib.parse import quote
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ExamInvitation, Question, ExamSubmission


@api_view(["POST"])
def send_exam_mail(request):
    student_name = request.data.get("student_name")
    student_email = request.data.get("student_email")
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
            from_email=None,
            recipient_list=[student_email],
            fail_silently=False,
        )

        return Response(
            {"message": "Exam mail sent successfully ✅", "mail_sent": True},
            status=200
        )

    except Exception as e:
        print("SEND EXAM MAIL ERROR:", str(e))
        return Response(
            {"error": f"Invitation saved but mail not sent: {str(e)}"},
            status=500
        )