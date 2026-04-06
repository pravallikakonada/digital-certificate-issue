from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def root_view(request):
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Digital Certificate System</title>
    </head>
    <body>
        <script>
            alert("Page not found (404)\\nRequest Method: GET\\nRequest URL: http://127.0.0.1:8000/\\nUsing the URLconf defined in backend.urls, Django tried these URL patterns, in this order:\\n\\nadmin/\\napi/accounts/\\napi/certificates/\\napi/exams/\\napi/courses/\\n\\nThe empty path didn’t match any of these.\\n\\nYou’re seeing this error because you have DEBUG = True in your Django settings file. Change that to False, and Django will display a standard 404 page.");
        </script>
        <h1>Welcome to Digital Certificate System API</h1>
        <p>Access the frontend at <a href="http://localhost:3001">http://localhost:3001</a></p>
    </body>
    </html>
    """
    return HttpResponse(html)

urlpatterns = [
    path("", root_view),
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/certificates/", include("certificates.urls")),
    path("api/exams/", include("exams.urls")),
    path("api/courses/", include("courses.urls")),
]