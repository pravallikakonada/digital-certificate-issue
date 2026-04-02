from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["POST"])
def signup_view(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not name or not email or not password:
        return Response({"error": "All fields are required"}, status=400)

    if User.objects.filter(username=email).exists():
        return Response({"error": "Email already exists"}, status=400)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name
    )

    return Response({
        "message": "Signup successful",
        "name": user.first_name,
        "email": user.email
    })


@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    user = authenticate(username=email, password=password)

    if user is None:
        return Response({"error": "Invalid email or password"}, status=400)

    return Response({
        "message": "Login successful",
        "name": user.first_name,
        "email": user.email
    })