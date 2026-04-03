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

Your certificate has been issued successfully.

Course: {course_title}
Certificate ID: {certificate_id}
Status: {status}

Login to view/download your certificate:
https://digital-certificate-issue.vercel.app/student-login

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
            "message": "Certificate created successfully",
            "certificate_id": cert.certificate_id
        })