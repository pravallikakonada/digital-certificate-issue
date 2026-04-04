from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Certificate


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
        })

    return Response(data)


@api_view(["POST"])
def issue_certificate(request):
    student_name = request.data.get("student_name")
    student_email = request.data.get("student_email")
    course_title = request.data.get("course_title")
    certificate_id = request.data.get("certificate_id")
    status = request.data.get("status", "Issued")

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
        )
    except Exception as e:
        print("CERTIFICATE SAVE ERROR:", str(e))
        return Response({"error": f"Save failed: {str(e)}"}, status=500)

    try:
        print(f"Sending email to {student_email} for certificate {certificate_id}")
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
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[student_email],
            fail_silently=False,
        )
        print(f"Email sent successfully to {student_email}")
        return Response(
            {
                "message": "Certificate issued successfully and mail sent ✅",
                "mail_sent": True
            },
            status=201
        )
    except Exception as e:
        print("CERTIFICATE MAIL ERROR:", str(e))
        print("Error type:", type(e).__name__)
        import traceback
        print("Traceback:", traceback.format_exc())
        return Response(
            {
                "message": "Certificate issued successfully ✅",
                "mail_sent": False,
                "error": str(e)
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
        })
    except Certificate.DoesNotExist:
        return Response({"error": "Certificate not found"}, status=404)