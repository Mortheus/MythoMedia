from django.db import models
from ..user.models import User
# Create your models here.
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    image = models.ImageField(upload_to='post_images', null=True, blank=True)
    posted_at = models.DateTimeField(auto_now_add=True)
    likes_count = models.IntegerField(default=0)
    tags = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.description

    def like(self, user):
        liked_post = LikedPost.objects.get_or_create(post=self, user=user)
        self.likes_count += 1

    def dislike(self, user):
        liked_post = LikedPost.objects.get(post=self, user=user)
        if liked_post:
            liked_post.delete()
        self.likes_count -= 1


class LikedPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)