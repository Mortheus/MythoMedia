from django.db import models
from ..user.models import User
class Group(models.Model):
    private = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    group_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_groups')
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=255)

    def __str__(self):
        return self.name

    def edit_name(self, new_name):
        self.name = new_name
        self.save(update_fields=['name'])

    def edit_description(self, new_description):
        self.description = new_description
        self.save(update_fields=['description'])


class Conversation(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name='conversations')

    def __str__(self):
        return self.group.name + "'s conversation"

    def add_member(self, user):
         if user not in self.members.all():
             self.members.add(user)
             self.save()
             return 1

    def remove_member(self, user):
        if user in self.members.all():
            self.members.remove(user)
            self.save()
            return 1




class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField(max_length=255)
    sent_at = models.DateTimeField(auto_now_add=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    read_by = models.ManyToManyField(User, blank=True, related_name='read_messages')

    def __str__(self):
        return self.sender.username + "'s message:" + str(self.id)