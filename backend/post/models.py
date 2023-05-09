from django.db import models
from ..user.models import User
from django.utils import timezone
from datetime import timedelta
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
        liked_post = LikedPost.objects.get_or_create(post=self, user=user)[0]
        print(liked_post)
        if liked_post.is_liked == False:
            self.likes_count += 1
            liked_post.is_liked = True
            liked_post.save(update_fields=['is_liked'])
            self.save(update_fields=['likes_count'])


    def dislike(self, user):
        liked_post = LikedPost.objects.get(post=self, user=user)
        if liked_post and liked_post.is_liked:
            liked_post.delete()
        self.likes_count -= 1
        self.save(update_fields=['likes_count'])

    def update_post(self, description, tags):
        updated_fields = {}
        if description is not None:
            updated_fields['description'] = description
            self.description = description
        if tags is not None:
            updated_fields['tags'] = tags
            self.tags = tags

        if updated_fields:
            post_version = PostVersion(post=self, updated_description=self.description, updated_tags=self.tags)
            if abs(self.posted_at - post_version.updated_at) >= timedelta(minutes=2):
                return
            self.save(update_fields=updated_fields)
            post_version.save()
            return 1





class LikedPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    is_liked = models.BooleanField(default=False)


class PostVersion(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    updated_description = models.CharField(max_length=255)
    updated_tags = models.CharField(max_length=255)
    updated_at = models.DateTimeField(default=timezone.now)