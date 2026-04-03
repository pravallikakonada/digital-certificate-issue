from django.urls import path
from .views import certificate_list_create, issue_certificate, verify_certificate

urlpatterns = [
    path("", certificate_list_create, name="certificate-list"),
    path("issue/", issue_certificate, name="issue-certificate"),
    path("verify/<str:certificate_id>/", verify_certificate, name="verify-certificate"),
]