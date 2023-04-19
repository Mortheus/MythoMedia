from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import FriendList
from .serializers import ShowFriendsSerializer
from ..user.models import User
from ..user.serializers import FriendDetailSerializer


# Create your views here.
class ShowFriendsView(APIView):
    serializer_class = ShowFriendsSerializer
    def get(self, request, format=None):
        dictionary = {}
        friendlists = FriendList.objects.all()
        for friendlist in friendlists:
            dictionary[friendlist.user.username] = [FriendDetailSerializer(friend).data for friend in friendlist.friends.all()]

        return Response(dictionary, status=status.HTTP_200_OK)
