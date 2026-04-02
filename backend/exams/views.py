from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import ExamInvitation, Question, ExamSubmission


@api_view(["POST"])
def send_exam_mail(request):
    student_name = request.data.get("student_name")
    student_email = request.data.get("student_email")
    course_title = request.data.get("course_title")

    if not student_name or not student_email or not course_title:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    exam_link = (
        f"https://digital-certificate-issue.vercel.app/auth-exam"
        f"?name={student_name}&email={student_email}&course={course_title}"
    )

    try:
        invitation = ExamInvitation.objects.create(
            student_name=student_name,
            student_email=student_email,
            course_title=course_title,
            exam_link=exam_link,
            status="Sent"
        )

        subject = f"Exam Link for {course_title}"
        message = f"""
Hello {student_name},

You have been invited to take the exam for the course: {course_title}.

Click the link below to start your exam:
{exam_link}

All the best!

Regards,
Admin
"""

        send_mail(
            subject,
            message,
            None,
            [student_email],
            fail_silently=False,
        )

        return Response(
            {
                "message": "Exam mail sent successfully",
                "exam_link": invitation.exam_link
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def exam_questions(request, course_title):
    questions = Question.objects.filter(course_title=course_title)

    data = []
    for q in questions:
        data.append({
            "id": q.id,
            "question": q.question_text,
            "option1": q.option1,
            "option2": q.option2,
            "option3": q.option3,
            "option4": q.option4,
            "correct_answer": q.correct_answer,
        })

    return Response(data, status=status.HTTP_200_OK)


@api_view(["POST"])
def submit_exam(request):
    student_name = request.data.get("student_name")
    student_email = request.data.get("student_email")
    course_title = request.data.get("course_title")
    score = int(request.data.get("score", 0))
    total_questions = int(request.data.get("total_questions", 0))

    if not student_name or not student_email or not course_title:
        return Response(
            {"error": "Missing required fields"},
            status=status.HTTP_400_BAD_REQUEST
        )

    result_text = "Passed" if total_questions > 0 and score >= (total_questions // 2) else "Failed"
    eligible = result_text == "Passed"

    submission = ExamSubmission.objects.create(
        student_name=student_name,
        student_email=student_email,
        course_title=course_title,
        score=score,
        total_questions=total_questions,
        result=result_text,
        eligible_for_certificate=eligible,
        status="Completed"
    )

    return Response(
        {
            "message": "Exam submitted successfully",
            "id": submission.id,
            "result": submission.result,
            "eligible_for_certificate": submission.eligible_for_certificate
        },
        status=status.HTTP_201_CREATED
    )


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

    return Response(data, status=status.HTTP_200_OK)