from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ExamInvitation, Question, ExamSubmission


@api_view(["GET", "POST"])
def exam_invitation_list_create(request):
    if request.method == "GET":
        invitations = ExamInvitation.objects.all()
        data = []

        for item in invitations:
            data.append({
                "student_name": item.student_name,
                "student_email": item.student_email,
                "course_title": item.course_title,
                "exam_link": item.exam_link,
                "status": item.status,
            })

        return Response(data)

    if request.method == "POST":
        student_name = request.data.get("student_name")
        student_email = request.data.get("student_email")
        course_title = request.data.get("course_title")

        exam_link = (
            f"http://10.20.1.126:5173/auth-exam"
            f"?name={student_name}&email={student_email}&course={course_title}"
        )

        invitation = ExamInvitation.objects.create(
            student_name=student_name,
            student_email=student_email,
            course_title=course_title,
            exam_link=exam_link,
            status="Pending"
        )

        send_mail(
            subject="Course Exam Invitation",
            message=f"""
Hi {student_name},

You have been invited to take the exam for the course: {course_title}

Click the link below to login/signup and take the exam:
{exam_link}

Thank you.
""",
            from_email="pravallikakonada984@gmail.com",
            recipient_list=[student_email],
            fail_silently=False,
        )

        return Response({
            "message": "Exam invitation sent successfully",
            "student_name": invitation.student_name,
            "student_email": invitation.student_email,
            "course_title": invitation.course_title,
            "exam_link": invitation.exam_link,
            "status": invitation.status,
        })


@api_view(["GET"])
def question_list_by_course(request):
    course_title = request.GET.get("course")

    questions = Question.objects.filter(course_title=course_title)
    data = []

    for q in questions:
        data.append({
            "id": q.id,
            "course_title": q.course_title,
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
    eligible_for_certificate = True if score >= 3 else False

    submission = ExamSubmission.objects.create(
        student_name=student_name,
        student_email=student_email,
        course_title=course_title,
        score=score,
        total_questions=total_questions,
        result=result,
        eligible_for_certificate=eligible_for_certificate,
        status="Completed"
    )

    ExamInvitation.objects.filter(
        student_email=student_email,
        course_title=course_title
    ).update(status="Completed")

    return Response({
        "message": "Exam submitted successfully",
        "student_name": submission.student_name,
        "student_email": submission.student_email,
        "course_title": submission.course_title,
        "score": submission.score,
        "total_questions": submission.total_questions,
        "result": submission.result,
        "eligible_for_certificate": submission.eligible_for_certificate,
        "status": submission.status,
    })


@api_view(["GET"])
def completed_tests(request):
    submissions = ExamSubmission.objects.all()
    data = []

    for item in submissions:
        data.append({
            "student_name": item.student_name,
            "student_email": item.student_email,
            "course_title": item.course_title,
            "score": item.score,
            "total_questions": item.total_questions,
            "result": item.result,
            "eligible_for_certificate": item.eligible_for_certificate,
            "status": item.status,
        })

    return Response(data)