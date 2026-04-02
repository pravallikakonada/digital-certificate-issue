from django.urls import path
from .views import certificate_list, issue_certificate, verify_certificate

urlpatterns = [
    path("", certificate_list, name="certificate_list"),
    path("issue/", issue_certificate, name="issue_certificate"),
    path("verify/<str:certificate_id>/", verify_certificate, name="verify_certificate"),
]