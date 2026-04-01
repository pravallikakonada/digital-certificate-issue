from django.contrib import admin
from .models import ExamInvitation, Question, ExamSubmission

admin.site.register(ExamInvitation)
admin.site.register(Question)
admin.site.register(ExamSubmission)