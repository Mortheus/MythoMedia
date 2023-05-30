from rest_framework import serializers
from .models import Conversation, Group, Message
from ..user.models import User

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['body']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name', 'description', 'id']

class PersonalChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name', 'group_owner', 'id']
class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['members']

class MessageDetailsSerializar(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['sender', 'body', 'sent_at']


class EditGroupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    class Meta:
        model = Group
        fields = ['name', 'description']


class ViewGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name', 'description', 'image', 'id', 'created_at', 'group_owner']


class GetMembersGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'profile_picture']
