from django.shortcuts import render
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CreatePostSerializer, GetPostDetailsSerializer
from .models import Post, LikedPost
from ..user.models import User
class CreatePostView(APIView):
    serializer_class = CreatePostSerializer
    def post(self, request, format=None):
        poster = request.user
        print(poster)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            post = Post.objects.create(
                user=poster,
                description=serializer.validated_data['description'],
                tags=serializer.validated_data['tags']
            )
            post.save()
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        else:
            return Response({'Creating Post Failed': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class GetAllPostsUserView(APIView):
    serializer_class = GetPostDetailsSerializer
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            if user:
                posts = Post.objects.filter(user=user)
                if posts:
                    serializer = self.serializer_class(posts, many=True)
                    for index in range(len(serializer.data)):
                        serializer.data[index]['user'] = user.username
                        print(serializer.data[index]['user'])
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(f'{user} has no posts', status=status.HTTP_200_OK)
        except:
            return Response({'Error' : 'User does not exist!'}, status=status.HTTP_404_NOT_FOUND)


class HandleLikePostView(APIView):
    def get(self, request, id, state):
        try:
            post = Post.objects.get(id=id)
            if state:
                post.like(request.user)
                return Response('Post successfully liked', status=status.HTTP_200_OK)
            else:
                post.dislike(request.user)
                return Response('Post successfully disliked', status=status.HTTP_200_OK)
        except:
            return Response({'Error': 'post not found'}, status=status.HTTP_404_NOT_FOUND)


class GetLikedPostsView(APIView):
    serializer_class = GetPostDetailsSerializer
    def get(self, request):
        try:
            user = User.objects.get(username=request.user.username)
            liked_posts = [post.post for post in LikedPost.objects.filter(user_id=user.id)]
            print(liked_posts)
            posts_owners = [post.user.username for post in liked_posts]
            serializer = self.serializer_class(liked_posts, many=True)
            for index, owner in zip(range(len(serializer.data)), posts_owners):
                print(serializer.data[index])
                serializer.data[index]['user'] = owner
            return Response(serializer.data, status=status.HTTP_200_OK)

        except:
            return Response({'Error': 'user not found'}, status=status.HTTP_404_NOT_FOUND)


class DeletePostView(APIView):
    def delete(self, request, id):
        try:
            post = Post.objects.get(id=id)
            if post:
                if post.user == request.user:
                    post.delete()
                    return Response('Successfully deleted the post', status=status.HTTP_200_OK)
                return Response({'Error':"Can't delete someone else's post"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'Error': 'post not found'}, status=status.HTTP_404_NOT_FOUND)




