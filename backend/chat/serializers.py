from rest_framework import serializers
from .models import Conversation, Group, Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['body']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name', 'description']

class PersonalChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name', 'group_owner']
class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['members']

class MessageDetailsSerializar(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['sender', 'body', 'sent_at']