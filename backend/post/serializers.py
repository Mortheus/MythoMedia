from rest_framework import serializers
from .models import Post, PostVersion


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields =['description', 'posted_at', 'tags']

class GetPostDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['user', 'description', 'tags', 'likes_count']

class EditPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['description', 'tags']


class AllPostEditsSerializers(serializers.ModelSerializer):
    class Meta:
        model = PostVersion
        fields = ['updated_at', 'updated_description', 'updated_tags']
        ordering = ['-updated_at']