"""
Middleware to disable CSRF token requirement for API endpoints.
This allows frontend to make POST requests to /api/* without CSRF tokens.
"""
from django.utils.deprecation import MiddlewareMixin
from django.views.decorators.csrf import csrf_exempt

class DisableCSRFForAPIMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Disable CSRF for all /api/ endpoints
        if request.path.startswith('/api/'):
            request.csrf_processing_done = True
        return None
