from django.shortcuts import render
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import FriendList, FriendRequest
from .serializers import ShowFriendsSerializer, ShowFriendRequestSerializer, FriendRequestSerializer, \
    HandleFriendRequestSerializer, BlockedUsersSerializer, FullBlockSerializer, FriendSerializer
from ..user.models import User
from ..user.serializers import FriendDetailSerializer


# Create your views here.
class ShowFriendsView(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BlockedUsersSerializer
    def get(self, request):
        user = User.objects.get(id=request.user.id)
        friends = user.friendlist.friends.all()
        if len(friends) == 0:
            return Response('No existing friends.')
        serializer = self.serializer_class(friends, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ShowFriendRequestsView(APIView):
    serializer_class = BlockedUsersSerializer
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

    def post(self, request, username,format=None):
        sender = request.user
        receiver = User.objects.get(username=username)
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

class GetBlockedUsers(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BlockedUsersSerializer
    def get(self, request):
        user = User.objects.get(id=request.user.id)
        blocked_users = user.block_list.blocked_users.all()
        if len(blocked_users) == 0:
            return Response('No existing blocked users.')
        serializer = self.serializer_class(blocked_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BlockUser(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, username):
        try:
            user_to_be_blocked = User.objects.get(username=username)
        except:
            return Response({'Error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        request.user.block_list.block(user_to_be_blocked)
        request.user.friendlist.unfriend(user_to_be_blocked)
        return Response({'msg':f'{user_to_be_blocked.username} successfully blocked!'}, status=status.HTTP_200_OK)


class UnblockUser(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, username):
        try:
            user_to_be_blocked = User.objects.get(username=username)
        except:
            return Response({'Error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        request.user.block_list.unblock(user_to_be_blocked)
        return Response({'msg':f'{user_to_be_blocked.username} successfully unblocked!'}, status=status.HTTP_200_OK)

class FullBlock(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FullBlockSerializer
    def post(self, request, username):
        try:
            user_to_be_blocked = User.objects.get(username=username)
        except:
            return Response({'Error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data['fullblock']:
                user_to_be_blocked.block_list.block(request.user)
                request.user.friendlist.unfriend(user_to_be_blocked)
                return Response({'msg':f'{user_to_be_blocked.username} successfully full-blocked!'}, status=status.HTTP_200_OK)
            return Response({'msg': f'Dear, {request} only {user_to_be_blocked.username} will be blocked.'})


class GetFriends(APIView):
    def get(self, request, user_ID):
        # try:
            user = User.objects.get(id=user_ID)
            friends = user.friendlist.friends.all()
            print(friends)
            serializer = FriendSerializer(friends, many=True, context={'user': user})
            print(serializer.data)
            for index, friend in enumerate(friends): #fiecare prieten pe care il am
              mutual = user.friendlist.get_mutual_friends(friend)
              serializer.data[index]['mutual_friends'] = mutual
            return Response(serializer.data, status=status.HTTP_200_OK)

        # except:
            # return Response({'error': 'user not found'}, status=status.HTTP_404_NOT_FOUND)