from django.db import models
from ..post.models import Post
from ..user.models import User
from django.utils import timezone, timesince
from datetime import timedelta
# Create your models here.
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    likes_count = models.IntegerField(default=0)
    timestamp = models.DateField(auto_now_add=True)

    def like(self, user):
        liked_comment = LikedComment.objects.get_or_create(comment=self, user=user)[0]
        if liked_comment.is_liked == False:
            self.likes_count += 1
            liked_comment.is_liked = True
            liked_comment.save(update_fields=['is_liked'])
            self.save(update_fields=['likes_count'])


    def dislike(self, user):
        liked_comment = LikedComment.objects.get(comment=self, user=user)
        if liked_comment and liked_comment.is_liked:
            liked_comment.delete()
            print('ajung aici?')
        self.likes_count -= 1
        self.save(update_fields=['likes_count'])


class LikedComment(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_liked = models.BooleanField(default=False)


