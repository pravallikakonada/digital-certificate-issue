from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Certificate


@api_view(["GET"])
def certificate_list(request):
    certificates = Certificate.objects.all().order_by("-id")
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

    Certificate.objects.create(
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
Course Name: {courseTitle if False else course_title}
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

    return Response({"message": "Certificate issued successfully ✅"}, status=201)


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