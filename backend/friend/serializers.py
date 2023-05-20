from .models import User
from ..friend.models import FriendList, FriendRequest
from rest_framework import serializers

class ShowFriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendList
        fields = ['user','friends']

class FriendSerializer(serializers.ModelSerializer):
    mutual_friends = serializers.SerializerMethodField()

    def get_mutual_friends(self, instance):
        request_friendlist = self.context['user'].friendlist
        mutual_friends = request_friendlist.get_mutual_friends(instance)
        return mutual_friends

    class Meta:
        model = User
        fields = ['username', 'profile_picture', 'mutual_friends']
class ShowFriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model =FriendRequest
        fields = ['is_active', 'timestamp']


class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['sender', 'receiver', 'timestamp']


class HandleFriendRequestSerializer(serializers.ModelSerializer):
    state = serializers.IntegerField()
    class Meta:
        model = FriendRequest
        fields = ['state']


class BlockedUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'profile_picture']

class FullBlockSerializer(serializers.ModelSerializer):
    fullblock = serializers.BooleanField(default=True)
                                                            