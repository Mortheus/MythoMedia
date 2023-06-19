from django.db.models import Q
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from ..user.models import User
from .models import Message, Conversation, Group
from .serializers import MessageSerializer, GroupSerializer, ConversationSerializer, PersonalChatSerializer, \
    MessageDetailsSerializar, EditGroupSerializer, ViewGroupSerializer, GetMembersGroupSerializer
from datetime import datetime
from django.core.signing import Signer
from rest_framework_simplejwt.authentication import JWTAuthentication


class CreateGroupChatView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            group = Group.objects.get_or_create(group_owner=request.user,
                                                name=serializer.validated_data['name'],
                                                description=serializer.validated_data['description'],
                                                private=False)
            if not group[1]:
                return Response('You already have a group with this name.', status=status.HTTP_400_BAD_REQUEST)
            group[0].save()
            serializer.validated_data['image'] = group[0].image.url
            serializer.validated_data['id'] = group[0].id
            conversation = Conversation.objects.get_or_create(group=group[0])
            if not conversation[1]:
                return Response('You already have a conversation here.', status=status.HTTP_400_BAD_REQUEST)
            conversation[0].add_member(request.user)
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        return Response({'Error': f'Something went wrong!{serializer.errors} '}, status=status.HTTP_400_BAD_REQUEST)


class CreatePersonalChatView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, username):
        try:
            user = User.objects.get(username=username)
        except:
            return Response({'Error': 'user not found'})
        usernames = sorted([request.user.username, user.username])
        group_name = f"{usernames[0]} & {usernames[1]}"
        owner = request.user if usernames[0] == request.user.username else user
        group = Group.objects.get_or_create(group_owner=owner, name=group_name)
        conversation = Conversation.objects.get_or_create(group=group[0])
        if not conversation[1]:
            return Response({'exists': True}, status=status.HTTP_200_OK)

        print(user)
        conversation[0].add_member(request.user)
        conversation[0].add_member(user)
        group[0].save()


        return Response(PersonalChatSerializer(group[0]).data, status=status.HTTP_201_CREATED)

class AddMemberToGroupView(APIView):
    authentication_classes = [JWTAuthentication,TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, group_ID, username):
        try:
            group = Group.objects.filter(Q(id=group_ID) & Q(conversation__members=request.user)).first()
            if group is None:
                raise Exception
        except:
            return Response({'Error': f'{request.user.username} you are not in this group {group_ID}!'}, status=status.HTTP_404_NOT_FOUND)
        if group.private:
            return Response({'Error': "This is a private conversation."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=username)
        except:
            return Response({'Error': 'User not found!'}, status=status.HTTP_404_NOT_FOUND)
        if group.conversation.add_member(user) is None:
            return Response({'Error': f'{user.username} already in {group.name}!'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(f'{user.username} added successfully!', status=status.HTTP_200_OK)

class RemoveMemberToGroupView(APIView):
    authentication_classes = [JWTAuthentication,TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def delete(self, request, group_ID, username):
        try:
            group = Group.objects.filter(Q(id=group_ID) & Q(group_owner=request.user)).first()
            if group is None:
                raise Exception
        except:
            return Response({'Error': f'{request.user.username} you do not own a group {group_ID}!'},
                            status=status.HTTP_404_NOT_FOUND)
        if group.private:
            return Response({'Error': "This is a private conversation."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=username)
        except:
            return Response({'Error': 'User not found!'}, status=status.HTTP_404_NOT_FOUND)
        if group.conversation.remove_member(user) is None:
            return Response({'Error': f'{user.username} no longer in {group.name}!'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(f'{user.username} removed successfully!')


class SearchGroupView(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer
    def get(self, request, query_name):
        groups = Group.objects.filter(Q(name=query_name) & Q(private=False))
        serializer = self.serializer_class(groups, many=True)
        for index, group in enumerate(groups):
            serializer.data[index]['group_owner'] = group.group_owner.username
            serializer.data[index]['group_id'] = group.id
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddMessageToGroup(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    def post(self, request, group_id):
        signer = Signer()
        DATE_FORMAT = '%b %d, %Y, %I:%M %p'
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            group = Group.objects.filter(id=group_id).first()
            serializer.validated_data['body'] = signer.sign(serializer.validated_data['body'])
            message = Message.objects.create(
                sender_id=request.user.id,
                body=serializer.validated_data['body'],
                conversation=group.conversation
            )
            message.save()
            new_serializer = MessageDetailsSerializar(message)
            dictionary_to_update = new_serializer.data
            datetime_format = datetime.strptime(new_serializer.data['sent_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
            dictionary_to_update['sent_at'] = datetime_format.strftime(DATE_FORMAT)
            dictionary_to_update['sender'] = message.sender.username
            dictionary_to_update['body'] = signer.unsign(new_serializer.data['body'])
            sender = User.objects.filter(username=dictionary_to_update['sender']).first()
            dictionary_to_update['profile_picture'] = sender.profile_picture.url
            return Response(dictionary_to_update, status=status.HTTP_200_OK)



class ConversationHistory(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = MessageDetailsSerializar
    def get(self, request, group_id):
        signer = Signer()
        DATE_FORMAT = '%b %d, %Y, %I:%M %p'
        group = Group.objects.filter(Q(id=group_id) & Q(conversation__members=request.user)).first()
        if group is None:
            return Response({'Error': 'You are not in such a group'}, status=status.HTTP_404_NOT_FOUND)
        messages = group.conversation.messages.all()
        serializer = self.serializer_class(messages, many=True)
        for index, message in enumerate(messages):
            datetime_format = datetime.strptime(serializer.data[index]['sent_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
            serializer.data[index]['sent_at'] = datetime_format.strftime(DATE_FORMAT)
            serializer.data[index]['sender'] = message.sender.username
            serializer.data[index]['body'] = signer.unsign(serializer.data[index]['body'])
            sender = User.objects.filter(username=serializer.data[index]['sender']).first()
            serializer.data[index]['profile_picture'] = sender.profile_picture.url
        return Response(serializer.data, status=status.HTTP_200_OK)




class EditGroup(APIView):
    serializer_class = EditGroupSerializer
    def put(self, request, group_ID):
        serializer = self.serializer_class(data=request.data)
        group = Group.objects.filter(Q(id=group_ID) & Q(group_owner_id=request.user.id)).first()
        if group is None:
            return Response('You do not have ownership of this group!', status=status.HTTP_403_FORBIDDEN)
        if serializer.is_valid():
            group.update_group(
                serializer.validated_data['name'],
                serializer.validated_data['description'],
                serializer.validated_data['image'])
        serializer.validated_data['image'] = group.image.url
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetChatsView(APIView):
    serializer_class = ViewGroupSerializer
    def get(self, request):
        user = request.user
        conversations = Conversation.objects.filter(members=user)
        groups = [conversation.group for conversation in conversations]
        serializer = self.serializer_class(groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetChatDetails(APIView):
    serializer_class = ViewGroupSerializer
    def get(self, request, group_ID):
        user = request.user
        group = Group.objects.filter(id=group_ID).first()
        serializer = self.serializer_class(group)
        return Response(serializer.data, status=status.HTTP_200_OK)



class GetMembersView(APIView):
    serializer_class = GetMembersGroupSerializer
    def get(self, request, group_ID):
        conversation = Conversation.objects.filter(group_id=group_ID).first()
        print(conversation)
        members = conversation.members.all()
        return Response(GetMembersGroupSerializer(members, many=True).data, status=status.HTTP_200_OK)


class LeaveGroupChat(APIView):
    def delete(self, request, group_ID):
        group = Group.objects.filter(id=group_ID).first()
        conversation = group.conversation
        if request.user in conversation.members.all():
            conversation.remove_member(request.user)
            return Response("Successfully left the group!")


