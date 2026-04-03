from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Certificate


@api_view(["GET", "POST"])
def certificate_list_create(request):
    if request.method == "GET":
        certificates = Certificate.objects.all()
        data = []

        for cert in certificates:
            data.append({
                "student_name": cert.student_name,
                "student_email": cert.student_email,
                "course_title": cert.course_title,
                "certificate_id": cert.certificate_id,
                "status": cert.status,
            })

        return Response(data)

    if request.method == "POST":
        student_name = request.data.get("student_name")
        student_email = request.data.get("student_email")
        course_title = request.data.get("course_title")
        certificate_id = request.data.get("certificate_id")
        status = request.data.get("status", "Issued")

        if not student_name or not student_email or not course_title or not certificate_id:
            return Response({"error": "All fields are required"}, status=400)

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
                subject="Your Certificate Has Been Issued",
                message=f"""Hello {student_name},

Congratulations! Your certificate has been issued successfully.

Student Name: {student_name}
Course: {course_title}
Certificate ID: {certificate_id}
Status: {status}

Login here to view your certificate:
https://digital-certificate-issue.vercel.app/student-login

You can also verify using this Certificate ID:
{certificate_id}

Regards,
Admin
""",
                from_email=None,
                recipient_list=[student_email],
                fail_silently=False,
            )
        except Exception as e:
            print("CERTIFICATE MAIL ERROR:", str(e))

        return Response({
            "message": "Certificate issued successfully",
            "certificate_id": cert.certificate_id
        }, status=201)