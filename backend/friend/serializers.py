from .models import User
from ..friend.models import FriendList, FriendRequest
from rest_framework import serializers

class ShowFriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendList
        fields = ['user','friends']