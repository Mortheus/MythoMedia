from django.contrib import admin
from .models import Group, Conversation, Message
admin.site.register(Group)
admin.site.register(Conversation)
admin.site.register(Message)