from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from ..user.models import User
from ..post.models import Post
from .models import Comment, LikedComment
from .serializers import AddCommentSerializer, AllCommentsPostSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import datetime



class AddCommentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AddCommentSerializer
    def post(self, request, post_id):
        DATE_FORMAT = '%b %d, %Y, %I:%M %p'
        try:
            user = User.objects.get(id=request.user.id)
            post = Post.objects.get(id=post_id)
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                comment = Comment.objects.create(
                    user=user,
                    post=post,
                    text=serializer.data['text']

                )
                comment.save()
                to_send = AllCommentsPostSerializer(comment).data
                to_send['user'] = user.username
                datetime_format = datetime.strptime(to_send['timestamp'], '%Y-%m-%dT%H:%M:%S.%fZ')
                to_send['timestamp'] = datetime_format.strftime(DATE_FORMAT)
                to_send['user_profile_picture'] = user.profile_picture.url
                print(to_send)
                return Response(to_send, status=status.HTTP_201_CREATED)
        except:
            return Response({'Error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class AllCommentsPostView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AllCommentsPostSerializer
    def get(self, request, post_id):
        DATE_FORMAT = '%b %d, %Y, %I:%M %p'
        post = Post.objects.get(id=post_id)
        comments = Comment.objects.filter(post_id=post.id)
        people = [comment.user.username for comment in comments]
        serializer = self.serializer_class(comments, many=True)
        for index, user in zip(range(len(serializer.data)), people):
            serializer.data[index]['user'] = user
            datetime_format = datetime.strptime(serializer.data[index]['timestamp'], '%Y-%m-%dT%H:%M:%S.%fZ')
            serializer.data[index]['timestamp'] = datetime_format.strftime(DATE_FORMAT)
            user_to = User.objects.get(username=user)
            serializer.data[index]['user_profile_picture'] = user_to.profile_picture.url

        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteCommentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def delete(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
            if comment.user.id != request.user.id:
                return Response({'Error': 'This belongs to someone else!'}, status=status.HTTP_403_FORBIDDEN)
            comment.delete()
            return Response('Comment deleted successfully!')
        except:
            return Response({'Error': 'Comment not found!'}, status=status.HTTP_404_NOT_FOUND)


class LikeCommentView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, comment_id):
        # try:
        comment = Comment.objects.get(id=comment_id)
        comment.like(request.user)
        return Response('Comment successfully liked', status=status.HTTP_200_OK)
        # except:
        #     return Response({'Error': 'comment not found'}, status=status.HTTP_404_NOT_FOUND)

class UnlikeCommentView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def put(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
            comment.dislike(request.user)
            return Response('Comment successfully disliked', status=status.HTTP_200_OK)
        except:
            return Response({'Error': 'comment not found'}, status=status.HTTP_404_NOT_FOUND)


class GetLikedComments(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        liked_comments = LikedComment.objects.filter(user=request.user)
        original_comments = [comment.comment.id for comment in liked_comments]
        response = [{"id": value} for value in original_comments]

        return Response(response, status=status.HTTP_200_OK)


