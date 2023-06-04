from rest_framework import serializers
from .models import Post, PostVersion


class CreatePostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    class Meta:
        model = Post
        fields =['description', 'posted_at', 'tags', 'image']

class GetPostDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['user', 'description', 'tags', 'likes_count', 'image', 'posted_at', 'id']

class EditPostSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)
    tags = serializers.CharField(required=False, allow_blank=True)
    image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = Post
        fields = ['description', 'tags', 'image']


class AllPostEditsSerializers(serializers.ModelSerializer):
    class Meta:
        model = PostVersion
        fields = ['updated_at', 'updated_description', 'updated_tags', 'updated_image', 'id']
        ordering = ['-updated_at']