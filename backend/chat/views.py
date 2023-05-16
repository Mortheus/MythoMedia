from django.db.models import Q
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from ..user.models import User
from .models import Message, Conversation, Group
from .serializers import MessageSerializer, GroupSerializer, ConversationSerializer, PersonalChatSerializer, \
    MessageDetailsSerializar, EditGroupSerializer
from datetime import datetime
from django.core.signing import Signer
class CreateGroupChatView(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            group = Group.objects.get_or_create(group_owner=request.user, name=serializer.validated_data['name'], description=serializer.validated_data['description'], private=False)
            if not group[1]:
                return Response('You already have a group with this name.', status=status.HTTP_400_BAD_REQUEST)
            group[0].save()
            conversation = Conversation.objects.get_or_create(group=group[0])
            if not conversation[1]:
                return Response('You already have a conversation here.', status=status.HTTP_400_BAD_REQUEST)
            conversation[0].add_member(request.user)
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        return Response({'Error': 'Something went wrong!'}, status=status.HTTP_400_BAD_REQUEST)


class CreatePersonalChatView(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, username):
        group = Group.objects.get_or_create(group_owner=request.user)
        conversation = Conversation.objects.get_or_create(group=group[0])
        if not conversation[1]:
            return Response('You already have a conversation here.', status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=username)
        except:
            return Response({'Error': 'user not found'})

        print(user)
        conversation[0].add_member(request.user)
        conversation[0].add_member(user)
        group[0].name = user.username
        group[0].save()


        return Response(PersonalChatSerializer(group[0]).data, status=status.HTTP_201_CREATED)

class AddMemberToGroupView(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, group_name, username):
        try:
            group = Group.objects.filter(Q(name=group_name) & Q(group_owner=request.user)).first()
            if group is None:
                raise Exception
        except:
            return Response({'Error': f'{request.user.username} you do not own a group {group_name}!'}, status=status.HTTP_404_NOT_FOUND)
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
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, group_name, username):
        try:
            group = Group.objects.filter(Q(name=group_name) & Q(group_owner=request.user)).first()
            if group is None:
                raise Exception
        except:
            return Response({'Error': f'{request.user.username} you do not own a group {group_name}!'},
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
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    def post(self, request, group_id):
        signer = Signer()
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
            return Response(status=status.HTTP_200_OK)



class ConversationHistory(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = MessageDetailsSerializar
    def get(self, request, group_name):
        signer = Signer()
        DATE_FORMAT = '%b %d, %Y, %I:%M %p'
        group = Group.objects.filter(Q(name=group_name) & Q(group_owner_id=request.user.id)).first()
        if group is None:
            return Response({'Error': 'You are not in such a group'}, status=status.HTTP_404_NOT_FOUND)
        print(group.conversation)
        messages = group.conversation.messages.all()
        serializer = self.serializer_class(messages, many=True)
        for index, message in enumerate(messages):
            datetime_format = datetime.strptime(serializer.data[index]['sent_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
            serializer.data[index]['sent_at'] = datetime_format.strftime(DATE_FORMAT)
            serializer.data[index]['sender'] = message.sender.username
            serializer.data[index]['body'] = signer.unsign(serializer.data[index]['body'])
        return Response(serializer.data, status=status.HTTP_200_OK)




class EditGroup(APIView):
    serializer_class = EditGroupSerializer
    def put(self, request, group_name):
        serializer = self.serializer_class(data=request.data)
        group = Group.objects.filter(Q(name=group_name) & Q(group_owner_id=request.user.id)).first()
        if group is None:
            return Response('You do not have ownership of this group!', status=status.HTTP_403_FORBIDDEN)
        if serializer.is_valid():
            group.update_group(serializer.validated_data['name'], serializer.validated_data['description'])
        return Response(serializer.data, status=status.HTTP_200_OK)