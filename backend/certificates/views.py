import traceback
from django.core.mail import EmailMessage, get_connection
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Certificate


def get_email_connection():
    """Get email connection based on configured backend"""
    if 'console' in settings.EMAIL_BACKEND.lower():
        # Console backend - no connection needed
        return get_connection()
    elif 'locmem' in settings.EMAIL_BACKEND.lower():
        # In-memory backend for testing
        return get_connection()
    else:
        # SMTP backend
        return get_connection(
            backend=settings.EMAIL_BACKEND,
            host=settings.EMAIL_HOST,
            port=settings.EMAIL_PORT,
            username=settings.EMAIL_HOST_USER,
            password=settings.EMAIL_HOST_PASSWORD,
            use_tls=settings.EMAIL_USE_TLS,
            use_ssl=settings.EMAIL_USE_SSL,
            timeout=settings.EMAIL_TIMEOUT,
        )


@api_view(["GET"])
def certificate_list_create(request):
    certificates = Certificate.objects.all()
    data = []

    for cert in certificates:
        data.append({
            "student_name": cert.student_name,
            "student_email": cert.student_email,
            "course_title": cert.course_title,
            "certificate_id": cert.certificate_id,
            "status": cert.status,
            "template": cert.template,
        })

    return Response(data)


@api_view(["POST"])
def issue_certificate(request):
    student_name = request.data.get("student_name")
    student_email = request.data.get("student_email")
    course_title = request.data.get("course_title")
    certificate_id = request.data.get("certificate_id")
    status = request.data.get("status", "Issued")
    template = request.data.get("template", "classic")

    if not student_name or not student_email or not course_title or not certificate_id:
        return Response({"error": "All fields are required"}, status=400)

    if Certificate.objects.filter(certificate_id=certificate_id).exists():
        return Response({"error": "Certificate ID already exists"}, status=400)

    try:
        Certificate.objects.create(
            student_name=student_name,
            student_email=student_email,
            course_title=course_title,
            certificate_id=certificate_id,
            status=status,
            template=template,
        )
    except Exception as e:
        print("CERTIFICATE SAVE ERROR:", str(e))
        return Response({"error": f"Save failed: {str(e)}"}, status=500)

    try:
        print(f"Sending email to {student_email} for certificate {certificate_id}")
        email = EmailMessage(
            subject="Certificate Issued Successfully",
            body=f"""Hello {student_name},

Your certificate has been issued successfully.

Student Name: {student_name}
Course Name: {course_title}
Certificate ID: {certificate_id}
Status: {status}

Login here to view your certificate:
http://localhost:5173/student-login

Regards,
Admin
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[student_email],
        )
        email.send(fail_silently=False)
        print(f"Email sent successfully to {student_email}")
        return Response(
            {
                "message": "Certificate issued successfully and mail sent ✅",
                "mail_sent": True
            },
            status=201
        )
    except Exception as e:
        print("CERTIFICATE MAIL ERROR:", type(e).__name__, str(e))
        traceback.print_exc()
        return Response(
            {
                "message": "Certificate issued successfully ✅",
                "mail_sent": False,
                "error": f"{type(e).__name__}: {str(e)}"
            },
            status=201
        )


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
            "template": cert.template,
        })
    except Certificate.DoesNotExist:
        return Response({"error": "Certificate not found"}, status=404)