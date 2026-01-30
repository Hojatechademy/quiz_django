from django.db import models

# Create your models here.

class Question(models.Model):
    question_text = models.CharField(max_length=255)

    def __str__(self):
        return self.question_text
    
class Option(models.Model):
    question = models.ForeignKey(
        Question,
        related_name="options",
        on_delete=models.CASCADE
    )
    option_text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.option_text
    
class QuizResult(models.Model):
    score = models.IntegerField()
    total_questions = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

