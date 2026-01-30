from django.shortcuts import render
from django.http import JsonResponse
from .models import Question, Option, QuizResult
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
def quiz_home(request):
    return render(request, 'quizapp/index.html')

def get_questions(request):
    questions = Question.objects.all()

    data = []

    for q in questions:
        options = list(q.options.values("id", "option_text"))

        data.append({
            "id": q.id,
            "question": q.question_text,
            "options": options
        })

    return JsonResponse(data, safe=False)

@csrf_exempt
def submit_answer(request):
    if request.method == "POST":
        body = json.loads(request.body)

        option_id = body.get("option_id")
        option = Option.objects.get(id=option_id)

        correct_option = Option.objects.get(
            question=option.question,
            is_correct=True
        )

        return JsonResponse({
            "correct": option.is_correct,
            "correct_option_id": correct_option.id
        })
    
@csrf_exempt
def finish_quiz(request):
    if request.method == "POST":
        body = json.loads(request.body)

        score = body.get("score")
        total = body.get("total")

        QuizResult.objects.create(
            score=score,
            total_questions=total
        )

        return JsonResponse({
            "message": "Quiz Completed and Score Saved!"
        })
