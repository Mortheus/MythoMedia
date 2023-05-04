from django.shortcuts import render
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import FriendList, FriendRequest
from .serializers import ShowFriendsSerializer, ShowFriendRequestSerializer, FriendRequestSerializer, \
    HandleFriendRequestSerializer
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


class ShowFriendRequestsView(APIView):
    serializer_class = ShowFriendRequestSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        serializer = self.serializer_class(data=request.data, many=True)
        receiver = request.user
        friend_requests = FriendRequest.objects.filter(receiver=receiver)
        return Response(ShowFriendRequestSerializer(friend_requests, many=True).data, status=status.HTTP_200_OK)


class SendFriendRequestView(APIView):
    serializer_class = ShowFriendRequestSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwargs = 'username'

    def post(self, request, format=None):
        sender = request.user
        print(sender)
        # serializer = self.serializer_class(data=request.data)
        receiver = request.GET.get(self.lookup_url_kwargs)
        receiver = User.objects.get(username=receiver)
        print(receiver)
        if FriendRequest.objects.filter(sender=sender, receiver=receiver).exists():
            return Response({'error': f'Friend request to {receiver} already sent'}, status=status.HTTP_409_CONFLICT)
        friend_request = FriendRequest.objects.create(sender=sender, receiver=receiver)
        print(friend_request)
        friend_request.save()
        return Response(FriendRequestSerializer(friend_request).data, status=status.HTTP_201_CREATED)


class HandleFriendRequestView(APIView):
    serializer_class = HandleFriendRequestSerializer
    lookup_url_args = ['username', 'state']
    def post(self, request, username, format=None):
        friend_request = FriendRequest.objects.get(sender__username=username, receiver__username=request.user.username)
        if friend_request is None:
            return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)
        options = {1: friend_request.accept,
                   0: friend_request.decline
                   }
        state = int(request.data.get(self.lookup_url_args[1]))
        options[state]()
        if state:
            return Response('Friend request accepted', status=status.HTTP_200_OK)
        else:
            return Response('Friend request declined', status=status.HTTP_200_OK)



class GetSuggestedFriendsView(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        user = request.user
        friend_list = user.friendlist
        suggestions = friend_list.friend_suggestions()

        return Response(suggestions, status=status.HTTP_200_OK)






