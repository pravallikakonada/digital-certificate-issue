from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import StudentAccount


@api_view(["POST"])
def signup(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not name or not email or not password:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if StudentAccount.objects.filter(email=email).exists():
        return Response(
            {"error": "Account already exists. Please login."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = StudentAccount.objects.create(
        name=name,
        email=email,
        password=password
    )

    return Response(
        {
            "message": "Signup successful",
            "name": user.name,
            "email": user.email
        },
        status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = StudentAccount.objects.get(email=email, password=password)
    except StudentAccount.DoesNotExist:
        return Response(
            {"error": "Invalid email or password"},
            status=status.HTTP_400_BAD_REQUEST
        )

    return Response(
        {
            "message": "Login successful",
            "name": user.name,
            "email": user.email
        },
        status=status.HTTP_200_OK
    )