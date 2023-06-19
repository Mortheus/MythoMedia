from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('login', index),
    path('homepage', index),
    path('friends', index),
    path('chats', index),
    path('blocked', index),
    path('feed', index),
    path('test', index),
    path('register', index),
    path('profile/<str:username>', index),
    path('reset/<str:uidb64>/<str:token>', index, name='reset_password'),
    path('forgot-password', index),
    path('post/<int:id>', index)
]
