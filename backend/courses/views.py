from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Course


@api_view(["GET"])
def get_courses(request):
    courses = Course.objects.all().values()
    return Response(courses)


@api_view(["POST"])
def add_course(request):
    title = request.data.get("title")
    description = request.data.get("description")

    course = Course.objects.create(
        title=title,
        description=description
    )

    return Response({"message": "Course added successfully"})


@api_view(["PUT"])
def update_course(request, id):
    try:
        course = Course.objects.get(id=id)
        course.title = request.data.get("title")
        course.description = request.data.get("description")
        course.save()

        return Response({"message": "Course updated"})
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)