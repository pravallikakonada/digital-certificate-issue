from django.urls import path
from .views import signup, login, admin_login
urlpatterns = [
    path("signup/", signup, name="signup"),
    path("login/", login, name="login"),
    path("admin-login/", admin_login, name="admin-login"),
]