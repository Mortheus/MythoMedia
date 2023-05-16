from django.urls import path
from .views import CreateGroupChatView, CreatePersonalChatView, RemoveMemberToGroupView, AddMemberToGroupView, \
    SearchGroupView, ConversationHistory, AddMessageToGroup, EditGroup

urlpatterns = [
    path('create-group', CreateGroupChatView.as_view()),
    path('create-personal/<str:username>', CreatePersonalChatView.as_view()),
    path('add/<str:group_name>/<str:username>', AddMemberToGroupView.as_view()),
    path('remove/<str:group_name>/<str:username>', RemoveMemberToGroupView.as_view()),
    path('search/<str:query_name>', SearchGroupView.as_view()),
    path('add-message/<str:id>', AddMessageToGroup.as_view()),
    path('conversation-history/<str:group_name>', ConversationHistory.as_view()),
    path('edit/<str:group_name>', EditGroup.as_view()),

]