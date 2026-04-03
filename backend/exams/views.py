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

        subject = f"Exam Link for {course_title}"
        message = f"""Hello {student_name},

You have been invited to take the exam for the course: {course_title}.

Click the link below to start your exam:
{exam_link}

Regards,
Admin
"""

        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [student_email],
            fail_silently=False,
        )

        return Response({"message": "Exam mail sent successfully ✅"}, status=200)

    except Exception as e:
        print("SEND EXAM MAIL ERROR:", str(e))
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def exam_questions(request, course_title):
    questions = Question.objects.filter(course_title=course_title)
    data = []

    for q in questions:
        data.append({
            "id": q.id,
            "question_text": q.question_text,
            "option1": q.option1,
            "option2": q.option2,
            "option3": q.option3,
            "option4": q.option4,
            "correct_answer": q.correct_answer,
        })

    return Response(data)


@api_view(["POST"])
def submit_exam(request):
    student_name = request.data.get("student_name")
    student_email = request.data.get("student_email")
    course_title = request.data.get("course_title")
    score = int(request.data.get("score", 0))
    total_questions = int(request.data.get("total_questions", 0))

    result = "Passed" if score >= 3 else "Failed"
    eligible_for_certificate = score >= 3

    submission = ExamSubmission.objects.create(
        student_name=student_name,
        student_email=student_email,
        course_title=course_title,
        score=score,
        total_questions=total_questions,
        result=result,
        eligible_for_certificate=eligible_for_certificate,
        status="Completed",
    )

    return Response({
        "message": "Exam submitted successfully ✅",
        "id": submission.id,
        "result": result,
        "score": score,
        "total_questions": total_questions,
        "eligible_for_certificate": eligible_for_certificate,
        "status": "Completed",
    })


@api_view(["GET"])
def completed_tests(request):
    submissions = ExamSubmission.objects.all().order_by("-id")
    data = []

    for s in submissions:
        data.append({
            "id": s.id,
            "student_name": s.student_name,
            "student_email": s.student_email,
            "course_title": s.course_title,
            "score": s.score,
            "total_questions": s.total_questions,
            "result": s.result,
            "eligible_for_certificate": s.eligible_for_certificate,
            "status": s.status,
        })

    return Response(data)