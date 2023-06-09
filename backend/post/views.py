from django.shortcuts import render
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CreatePostSerializer, GetPostDetailsSerializer, EditPostSerializer, AllPostEditsSerializers
from .models import Post, LikedPost, PostVersion
from ..user.models import User
from ..comment.models import LikedComment, Comment
from datetime import datetime
from rest_framework_simplejwt.authentication import JWTAuthentication


class CreatePostView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    serializer_class = CreatePostSerializer

    def post(self, request, format=None):
        DATE_FORMAT = '%b %d, %Y, %I:%M %p'
        poster = request.user
        print(poster)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if 'image' in serializer.data.keys():
                post = Post.objects.create(
                    user=poster,
                    description=serializer.validated_data['description'],
                    tags=serializer.validated_data['tags'],
                    image=serializer.validated_data['image']
                )
            else:
                post = Post.objects.create(
                    user=poster,
                    description=serializer.validated_data['description'],
                    tags=serializer.validated_data['tags'],
                )
            post.save()
            # serializer.validated_data['image'] = post.image.url
            data_to_send = GetPostDetailsSerializer(post).data
            user_post = User.objects.get(id=request.user.id)
            data_to_send['user_profile_picture'] = user_post.profile_picture.url
            data_to_send['user'] = user_post.username
            datetime_format = datetime.strptime(data_to_send['posted_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
            data_to_send['posted_at'] = datetime_format.strftime(DATE_FORMAT)

            return Response(data_to_send, status=status.HTTP_201_CREATED)
        else:
            return Response({'Creating Post Failed': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class GetAllPostsUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = GetPostDetailsSerializer

    def get(self, request, username):
        DATE_FORMAT = '%b %d, %Y, %I:%M %p'
        # try:
        user = User.objects.get(username=username)
        if user:
            posts = Post.objects.filter(user=user)
            if posts:
                serializer = self.serializer_class(posts, many=True)
                for index in range(len(serializer.data)):
                    user_post = User.objects.get(id=serializer.data[index]['user'])
                    serializer.data[index]['user_profile_picture'] = user_post.profile_picture.url
                    serializer.data[index]['user'] = user.username
                    datetime_format = datetime.strptime(serializer.data[index]['posted_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
                    serializer.data[index]['posted_at'] = datetime_format.strftime(DATE_FORMAT)

                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(f'{user} has no posts', status=status.HTTP_200_OK)
        # except:
        #     return Response({'Error' : 'User does not exist!'}, status=status.HTTP_404_NOT_FOUND)


class HandleLikePostView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id, state):
        try:
            DATE_FORMAT = '%b %d, %Y, %I:%M %p'
            post = Post.objects.filter(id=id).first()
            serializer = GetPostDetailsSerializer(post)
            to_send = serializer.data
            to_send['user'] = post.user.username
            datetime_format = datetime.strptime(to_send['posted_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
            to_send['posted_at'] = datetime_format.strftime(DATE_FORMAT)
            if state:
                post.like(request.user)
                return Response(to_send, status=status.HTTP_200_OK)
            else:
                post.dislike(request.user)
                return Response(to_send, status=status.HTTP_200_OK)
        except:
            return Response({'Error': 'post not found'}, status=status.HTTP_404_NOT_FOUND)


class GetLikedPostsView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
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
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            post = Post.objects.get(id=id)
            if post:
                if post.user == request.user:
                    post.delete()
                    return Response('Successfully deleted the post', status=status.HTTP_200_OK)
                return Response({'Error': "Can't delete someone else's post"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'Error': 'post not found'}, status=status.HTTP_404_NOT_FOUND)


class EditPostView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = EditPostSerializer

    def put(self, request, post_id):
        DATE_FORMAT = '%b %d, %Y, %I:%M %p'
        post = Post.objects.get(id=post_id)
        serializer = self.serializer_class(data=request.data)
        print(serializer.initial_data)
        if serializer.is_valid():
            if post.update_post(serializer.validated_data):
                to_send = GetPostDetailsSerializer(post).data
                if 'image' in serializer.validated_data:
                    to_send['image'] = post.image.url
                else:
                    to_send['image'] = None
                to_send['user'] = post.user.username
                datetime_format = datetime.strptime(to_send['posted_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
                to_send['posted_at'] = datetime_format.strftime(DATE_FORMAT)
                return Response(to_send, status=status.HTTP_200_OK)
            return Response({'Error': 'Too much time has passed!'}, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.errors)


class AllPostEditsView(APIView):
    authentication_classes = [JWTAuthentication,TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AllPostEditsSerializers

    def get(self, request, post_id):
        DATE_FORMAT = '%b %d, %Y, %I:%M %p'
        try:
            post = Post.objects.get(id=post_id)
            post_versions = PostVersion.objects.filter(post=post)
            serializer = self.serializer_class(post_versions, many=True)
            for index in range(len(serializer.data)):
                datetime_format = datetime.strptime(serializer.data[index]['updated_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
                serializer.data[index]['updated_at'] = datetime_format.strftime(DATE_FORMAT)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'Error': 'Post not found!'}, status=status.HTTP_404_NOT_FOUND)


class FilterPostsByTag(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = GetPostDetailsSerializer

    def get(self, request, search_tag):
        posts = Post.objects.filter(tags__icontains=search_tag)
        if posts:
            serializer = self.serializer_class(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response('No posts with that tag', status=status.HTTP_404_NOT_FOUND)


class GetPostDetail(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        DATE_FORMAT = '%b %d, %Y, %I:%M %p'
        post = Post.objects.filter(id=post_id).first()
        serializer = GetPostDetailsSerializer(post)
        to_send = serializer.data
        to_send['user'] = post.user.username
        datetime_format = datetime.strptime(to_send['posted_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
        to_send['posted_at'] = datetime_format.strftime(DATE_FORMAT)
        return Response(to_send, status=status.HTTP_200_OK)


class GetAllPostsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = GetPostDetailsSerializer

    def get(self, request):
        DATE_FORMAT = '%b %d, %Y, %I:%M %p'
        # try:
        posts = Post.objects.all()
        if posts:
            serializer = self.serializer_class(posts, many=True)
            for index in range(len(serializer.data)):
                user_post = User.objects.get(id=serializer.data[index]['user'])
                serializer.data[index]['user_profile_picture'] = user_post.profile_picture.url
                serializer.data[index]['user'] = user_post.username
                datetime_format = datetime.strptime(serializer.data[index]['posted_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
                serializer.data[index]['posted_at'] = datetime_format.strftime(DATE_FORMAT)

            return Response(serializer.data, status=status.HTTP_200_OK)
    # except:
    #     return Response({'Error' : 'User does not exist!'}, status=status.HTTP_404_NOT_FOUND)
