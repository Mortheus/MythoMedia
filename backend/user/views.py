import os

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponse, FileResponse
from django.shortcuts import render
from django.utils.http import urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import User
from backend.user.serializers import UserSerializer, RegisterUserSerializer, LoginUserSerializer, \
    PasswordResetSerializer, InitiateResetPasswordSerializer, UpdateProfileSerializer, GetUserDetailSerializer, FriendDetailSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.conf import settings
from .token import account_activation_token, account_password_reset_token
from django.core.files import File
import io



# Create your views here.
class ListUsersView(APIView):
    serializer_class = UserSerializer

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = self.serializer_class(users, many=True)
        return JsonResponse(serializer.data, safe=False)


class RegisterUserView(APIView):
    serializer_class = RegisterUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.create(request.data)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response({"Register Failed": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginUserView(APIView):
    serializer_class = LoginUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')
            user = authenticate(request, email=email, password=password)
            print(user)
            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                request.session['user_token'] = token.key
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            else:
                return Response({'User not found': 'Invalid credentials'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ActivationMailView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user.email and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save(update_fields=['is_active'])
            return Response({'message': 'Account activated successfully. You can now login in!'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Activation link is invalid.'}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    serializer_class = PasswordResetSerializer
    def post(self, request, uidb64, token):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                uid = urlsafe_base64_decode(uidb64).decode()
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None

            if user and account_password_reset_token.check_token(user, token):
                serializer.update(user, serializer.validated_data)
                print(user.password)
                return Response({'msg': 'Changed Password Successfully'}, status=status.HTTP_200_OK)

            return Response({'error': 'Could not update the password'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)




class InitiateResetPasswordView(APIView):
    serializer_class = InitiateResetPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        print(request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            if serializer.validated_data['initiate']:
                serializer.send_email(serializer.validated_data['email'])
                return Response({"msg": "Email sent successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "User didn't select the option"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Response': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UpdateProfileView(APIView):
    serializer_class = UpdateProfileSerializer
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = self.request.user
        return Response({'message': f'Hello, {user.username}'})
    def put(self, request):
        if request.user.is_authenticated:
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                print(type(serializer.validated_data['birthdate']))
                serializer.update(request.user, serializer.validated_data)

                serializer.validated_data['profile_picture'] = request.user.profile_picture.url
                return Response(GetUserDetailSerializer(request.user).data, status=status.HTTP_200_OK)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": f'{request.user} is not authenticated.'}, status=status.HTTP_400_BAD_REQUEST)




class GetUserDetailView(APIView):
    serializer_class = GetUserDetailSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, userID,format=None):
        # try:
        user = User.objects.get(id=userID)
        number_of_posts = len(user.post_set.all())
        number_of_friends = len(user.friendlist.friends.all())
        serializer = self.serializer_class(user)
        serializer.data['number_of_posts'] = number_of_posts
        serializer.data['number_of_friends'] = number_of_friends
        print(serializer.data)
        # except:
        #     return Response({'error': f'User with the id={id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data, status=status.HTTP_200_OK)



class GetUserFriendListView(APIView):
    serializer_class = FriendDetailSerializer
    lookup_url_kwargs = 'username'
    def get(self, request, format=None):
        serializer = FriendDetailSerializer(data=request.data)
        if serializer.is_valid():
            username = request.GET.get(self.lookup_url_kwargs)
            user = User.objects.get(username=username)
            print(user)
            if user:
                friendlist = user.friendlist
                friends = friendlist.friends.all()
                return Response(FriendDetailSerializer(friends, many=True).data, status=status.HTTP_200_OK)
            return Response({'error': 'User with the id not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'invalid data'}, status=status.HTTP_400_BAD_REQUEST)



class ViewProfilePicture(APIView):
    def get(self, request, filename):
        try:
            path = os.path.join(settings.MEDIA_ROOT, 'profile_pics', filename)
            return FileResponse(open(path, 'rb'), content_type='image/jpeg')
        except FileNotFoundError:
            return Response({'Error': 'File not Found!'})

class ViewPostPicture(APIView):
    def get(self, request, filename):
        try:
            path = os.path.join(settings.MEDIA_ROOT, 'post_images', filename)
            return FileResponse(open(path, 'rb'), content_type='image/jpeg')
        except FileNotFoundError:
            return Response({'Error': 'File not Found!'})


class DecodeTokenUser(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        token_key = request.data.get('token')
        token = Token.objects.get(key=token_key)
        user_id = token.user_id


        return Response({'user_id': user_id})

