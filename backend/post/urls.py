from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from backend.post.views import CreatePostView, GetAllPostsUserView, HandleLikePostView, GetLikedPostsView, \
    DeletePostView, EditPostView, AllPostEditsView, FilterPostsByTag, GetPostDetail, GetAllPostsView

urlpatterns = [
    path('', CreatePostView.as_view()),
    path('/user/<str:username>',GetAllPostsUserView.as_view()),
    path('/post/<int:id>/<int:state>', HandleLikePostView.as_view()),
    path('/liked', GetLikedPostsView.as_view()),
    path('/delete/<int:id>', DeletePostView.as_view()),
    path('/edit/<int:post_id>', EditPostView.as_view()),
    path('/all_edits/<int:post_id>', AllPostEditsView.as_view()),
    path('/search/<str:search_tag>', FilterPostsByTag.as_view()),
    path('/details/<int:post_id>', GetPostDetail.as_view()),
    path('/feed', GetAllPostsView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)