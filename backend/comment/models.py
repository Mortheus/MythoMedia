from django.db import models
from ..post.models import Post
from ..user.models import User
# Create your models here.
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    timestamp = models.DateField(auto_now_add=True)
