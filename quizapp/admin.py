from django.contrib import admin
from .models import Question, Option, QuizResult

# Register your models here.

admin.site.register(Question)
admin.site.register(Option)
admin.site.register(QuizResult)
