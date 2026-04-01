from rest_framework import serializers
from django.contrib.auth.models import User
from certificates.models import CertificateRecipient


class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=4)

    def validate_email(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("User already exists with this email.")

        # Email certificate recipient table lo undali
        if not CertificateRecipient.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is not eligible for signup.")

        return value

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)