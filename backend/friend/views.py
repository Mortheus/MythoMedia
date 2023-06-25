from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import FriendList, FriendRequest
from .serializers import ShowFriendsSerializer, ShowFriendRequestSerializer, FriendRequestSerializer, \
    HandleFriendRequestSerializer, BlockedUsersSerializer, FullBlockSerializer, FriendSerializer, ShowFriendRequests
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
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        receiver = request.user
        friend_requests = FriendRequest.objects.filter(receiver=receiver, is_active=True)
        print("REQUESTS", [request.is_active for request in friend_requests])
        keys = ['is_active', 'username', 'profile_picture', 'id']
        data = [{key: value for key, value in
                 zip(keys, [request.is_active, request.sender.username, request.sender.profile_picture.url, request.id])} for
                request in friend_requests]
        print(data)
        return Response(ShowFriendRequests(data=data, many=True).initial_data, status=status.HTTP_200_OK)


class SendFriendRequestView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, username, format=None):
        sender = request.user
        receiver = User.objects.get(username=username)
        existing_request = FriendRequest.objects.filter(
            (Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
        ).first()
        if existing_request:
            if existing_request.is_active == False:
                existing_request.is_active = True
                existing_request.save(update_fields=['is_active'])
                return Response({'msg': 'Friend requests resent'})
            else:
                return Response({'error': f'Friend request to {receiver} already sent'}, status=status.HTTP_200_OK)
        friend_request = FriendRequest.objects.create(sender=sender, receiver=receiver)
        return Response(FriendRequestSerializer(friend_request).data, status=status.HTTP_201_CREATED)


class HandleFriendRequestView(APIView):
    serializer_class = HandleFriendRequestSerializer
    lookup_url_args = ['username', 'state']

    def post(self, request, username, format=None):
        friend_request = FriendRequest.objects.filter(Q(sender__username=username, receiver__username=request.user.username) | Q(
            sender__username=request.user.username, receiver__username=username)).first()
        print("HANDLE REQUEST", friend_request)
        if friend_request is None:
            return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)
        options = {1: friend_request.accept,
                   0: friend_request.decline
                   }
        friend_request.is_active = False
        friend_request.save(update_fields=['is_active'])
        print(friend_request.is_active)
        state = int(request.data.get(self.lookup_url_args[1]))
        options[state]()
        print(friend_request.is_active)
        if state:
            return Response('Friend request accepted', status=status.HTTP_200_OK)
        else:
            return Response('Friend request declined', status=status.HTTP_200_OK)


class GetSuggestedFriendsView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        friend_list = user.friendlist
        suggestions = friend_list.friend_suggestions()

        return Response(suggestions, status=status.HTTP_200_OK)


class RemoveFriend(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, username):
        friendlist = request.user.friendlist
        to_delete = User.objects.filter(username=username).first()
        friendlist.unfriend(to_delete)
        friendRequest = FriendRequest.objects.filter(
            Q(sender__username=username, receiver__username=request.user.username) | Q(
                sender__username=request.user.username, receiver__username=username)).first()
        friendRequest.delete()
        return Response({'msg': f'No longer friends with {username}',
                         'user': username}, status=status.HTTP_200_OK)


class GetBlockedUsers(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BlockedUsersSerializer

    def get(self, request):
        user = User.objects.get(id=request.user.id)
        blocked_users = user.block_list.blocked_users.all()
        print(blocked_users)
        serializer = self.serializer_class(blocked_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BlockUser(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        try:
            user_to_be_blocked = User.objects.get(username=username)
        except:
            return Response({'Error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        request.user.block_list.block(user_to_be_blocked)
        request.user.friendlist.unfriend(user_to_be_blocked)
        friendRequest = FriendRequest.objects.filter(
            Q(sender__username=username, receiver__username=request.user.username) | Q(
                sender__username=request.user.username, receiver__username=username)).first()
        friendRequest.delete()
        return Response({'msg': f'{user_to_be_blocked.username} successfully blocked!'}, status=status.HTTP_200_OK)


class UnblockUser(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        try:
            user_to_be_blocked = User.objects.get(username=username)
        except:
            return Response({'Error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        request.user.block_list.unblock(user_to_be_blocked)
        return Response({'msg': f'{user_to_be_blocked.username} successfully unblocked!',
                         'user': user_to_be_blocked.id}, status=status.HTTP_200_OK)


class FullBlock(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
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
                friendRequest = FriendRequest.objects.filter(
                    Q(sender__username=username, receiver__username=request.user.username) | Q(
                        sender__username=request.user.username, receiver__username=username)).first()
                friendRequest.delete()
                return Response({'msg': f'{user_to_be_blocked.username} successfully full-blocked!'},
                                status=status.HTTP_200_OK)
            return Response({'msg': f'Dear, {request} only {user_to_be_blocked.username} will be blocked.'})


class GetFriends(APIView):
    def get(self, request, user_ID):
        try:
            user = User.objects.get(id=user_ID)
            friends = user.friendlist.friends.all()
            print(friends)
            serializer = FriendSerializer(friends, many=True, context={'user': user})
            print(serializer.data)
            for index, friend in enumerate(friends):
                mutual = user.friendlist.get_mutual_friends(friend)
                serializer.data[index]['mutual_friends'] = mutual
            return Response(serializer.data, status=status.HTTP_200_OK)

        except:
            return Response({'error': 'user not found'}, status=status.HTTP_404_NOT_FOUND)


class GetFriendShipStatus(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user = User.objects.get(username=username)
        if user in request.user.friendlist.friends.all():
            return Response({'status': True}, status=status.HTTP_200_OK)
        else:
            print("false")
            return Response({'status': False}, status=status.HTTP_200_OK)


class GetBlockedStatus(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user = User.objects.get(username=username)
        if user in request.user.block_list.blocked_users.all() or request.user in user.block_list.blocked_users.all():
            print("STATUS: true")
            return Response({'status': True}, status=status.HTTP_200_OK)
        else:
            print("STATUS: false")
            return Response({'status': False}, status=status.HTTP_200_OK)

