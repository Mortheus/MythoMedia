from rest_framework import serializers
from .models import Comment

class AddCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text']

class AllCommentsPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['user', 'text', 'likes_count']