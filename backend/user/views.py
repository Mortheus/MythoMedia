from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from backend.user.serializers import UserSerializer, RegisterUserSerializer, LoginUserSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


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
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            else:
                return Response({'User not found': 'Invalid credentials'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)