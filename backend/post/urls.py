from django.urls import path

from backend.post.views import CreatePostView, GetAllPostsUserView, HandleLikePostView, GetLikedPostsView, \
    DeletePostView

urlpatterns = [
    path('', CreatePostView.as_view()),
    path('user/<str:username>',GetAllPostsUserView.as_view()),
    path('/post/<int:id>/<int:state>', HandleLikePostView.as_view()),
    path('/liked', GetLikedPostsView.as_view()),
    path('/delete/<int:id>', DeletePostView.as_view())
]