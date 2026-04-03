from django.core.mail import send_mail
from django.conf import settings
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

        Certificate.objects.create(
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

Regards,
Admin
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[student_email],
                fail_silently=True,
            )
        except Exception as e:
            print("CERTIFICATE MAIL ERROR:", str(e))

        return Response({"message": "Certificate issued successfully ✅"}, status=201)


@api_view(["POST"])
def issue_certificate(request):
    return certificate_list_create(request)


@api_view(["GET"])
def verify_certificate(request, certificate_id):
    try:
        cert = Certificate.objects.get(certificate_id=certificate_id)
        return Response({
            "student_name": cert.student_name,
            "student_email": cert.student_email,
            "course_title": cert.course_title,
            "certificate_id": cert.certificate_id,
            "status": cert.status,
        })
    except Certificate.DoesNotExist:
        return Response({"error": "Certificate not found"}, status=404)