from django.urls import path
from .views import quiz_home, get_questions, submit_answer, finish_quiz

urlpatterns = [
    path("", quiz_home),
    path("questions/", get_questions),
    path("submit/", submit_answer),
    path("finish/", finish_quiz)
]