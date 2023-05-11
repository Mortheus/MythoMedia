from rest_framework import serializers
from .models import Post, PostVersion


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields =['description', 'posted_at', 'tags', 'image']

class GetPostDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['user', 'description', 'tags', 'likes_count', 'image']

class EditPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['description', 'tags', 'image']


class AllPostEditsSerializers(serializers.ModelSerializer):
    class Meta:
        model = PostVersion
        fields = ['updated_at', 'updated_description', 'updated_tags', 'updated_image']
        ordering = ['-updated_at']