from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Certificate


@api_view(["POST"])
def issue_certificate(request):
    student_name = request.data.get("student_name")
    student_email = request.data.get("student_email")
    course_title = request.data.get("course_title")
    certificate_id = request.data.get("certificate_id")
    status = request.data.get("status", "Issued")

    if not student_name or not student_email or not course_title or not certificate_id:
        return Response({"error": "All fields are required"}, status=400)

    # same student + same course duplicate block
    existing_certificate = Certificate.objects.filter(
        student_email=student_email,
        course_title=course_title
    ).first()

    if existing_certificate:
        return Response(
            {"error": "Certificate already issued for this student and course"},
            status=400
        )

    if Certificate.objects.filter(certificate_id=certificate_id).exists():
        return Response({"error": "Certificate ID already exists"}, status=400)

    cert = Certificate.objects.create(
        student_name=student_name,
        student_email=student_email,
        course_title=course_title,
        certificate_id=certificate_id,
        status=status,
    )

    try:
        send_mail(
            subject="Certificate Issued Successfully",
            message=f"""Hello {student_name},

Your certificate has been issued successfully.

Student Name: {student_name}
Course Name: {course_title}
Certificate ID: {certificate_id}
Status: {status}

Login here to view your certificate:
https://digital-certificate-issue.vercel.app/student-login

Regards,
Admin
""",
            from_email="pravallikakonada984@gmail.com",
            recipient_list=[student_email],
            fail_silently=True,
        )
    except Exception as e:
        print("MAIL ERROR:", str(e))

    return Response(
        {"message": "Certificate issued successfully ✅"},
        status=201
    )