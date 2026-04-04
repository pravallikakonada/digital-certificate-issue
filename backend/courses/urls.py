from django.urls import path
from .views import course_list_create, course_detail, final_project_list_create, final_project_detail

urlpatterns = [
    path("", course_list_create, name="course-list-create"),
    path("<int:pk>/", course_detail, name="course-detail"),
    path("final-projects/", final_project_list_create, name="final-project-list-create"),
    path("final-projects/<int:pk>/", final_project_detail, name="final-project-detail"),
]