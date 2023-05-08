from django.urls import path

from backend.comment.views import AddCommentView, AllCommentsPostView, DeleteCommentView, LikeCommentView, \
    UnlikeCommentView

urlpatterns = [
    path('/<int:post_id>', AddCommentView.as_view()),
    path('/all_comments/<int:post_id>', AllCommentsPostView.as_view()),
    path('/delete/<int:comment_id>', DeleteCommentView.as_view()),
    path('/like/<int:comment_id>', LikeCommentView.as_view()),
    path('/unlike/<int:comment_id>', UnlikeCommentView.as_view()),

]