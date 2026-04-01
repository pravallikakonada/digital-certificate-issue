from django.contrib import admin
from .models import CertificateTemplate, CourseTemplateMap

admin.site.register(CertificateTemplate)
admin.site.register(CourseTemplateMap)