from rest_framework import serializers
from .models import Comment

class AddCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text']

class AllCommentsPostSerializer(serializers.ModelSerializer):
    user_profile_picture = serializers.SerializerMethodField()

    def get_user_profile_picture(self, obj):
        return obj.user.profile_picture.url
    class Meta:
        model = Comment
        fields = ['user', 'text', 'likes_count', 'timestamp','id', 'user_profile_picture']


