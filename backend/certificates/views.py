from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Certificate
import uuid


@api_view(["GET"])
def certificate_list(request):
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


@api_view(["POST"])
def issue_certificate(request):
    student_name = request.data.get("student_name")
    student_email = request.data.get("student_email")
    course_title = request.data.get("course_title")
    certificate_id = request.data.get("certificate_id")
    status = request.data.get("status", "Issued")

    if not student_name or not student_email or not course_title:
        return Response({"error": "Missing required fields"}, status=400)

    if not certificate_id:
        certificate_id = "CERT-" + str(uuid.uuid4())[:8].upper()

    if Certificate.objects.filter(certificate_id=certificate_id).exists():
        return Response({"error": "Certificate ID already exists"}, status=400)

    cert = Certificate.objects.create(
        student_name=student_name,
        student_email=student_email,
        course_title=course_title,
        certificate_id=certificate_id,
        status=status,
    )

    login_link = f"http://192.168.29.45:5173/login"
    verify_link = f"http://192.168.29.45:5173/verify?certificateId={certificate_id}"

    send_mail(
        subject="Certificate Issued Successfully",
        message=f"""
Hi {student_name},

You have successfully completed your test ✅

Your certificate has been issued successfully.

Course: {course_title}
Certificate ID: {certificate_id}
Status: {status}

Please login to view your certificate:
{login_link}

Verify your certificate:
{verify_link}

Thank you.
""",
        from_email="pravallikakonada984@gmail.com",
        recipient_list=[student_email],
        fail_silently=False,
    )

    return Response({
        "message": "Certificate created successfully and email sent",
        "student_name": cert.student_name,
        "student_email": cert.student_email,
        "course_title": cert.course_title,
        "certificate_id": cert.certificate_id,
        "status": cert.status,
    })


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
        return Response({"error": "Invalid Certificate"}, status=404)