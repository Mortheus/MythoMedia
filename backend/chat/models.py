from django.db import models
from ..user.models import User
from fernet_fields import EncryptedTextField
class Group(models.Model):
    private = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    group_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_groups')
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=255, blank=True)
    image = models.ImageField(upload_to='profile_pics', default='profile_pics/default_profile.jpg', blank=True, null=True)

    def __str__(self):
        return self.name

    def edit_name(self, new_name):
        self.name = new_name
        self.save(update_fields=['name'])

    def edit_description(self, new_description):
        self.description = new_description
        self.save(update_fields=['description'])

    def update_group(self, new_name, new_description):
        updated_fields = {}
        if new_name:
            updated_fields['name'] = new_name
            self.name = new_name
        if new_description:
            updated_fields['description'] = new_description
            self.description = new_description
        if updated_fields:
            self.save(update_fields=updated_fields)
            return 1




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
    body = EncryptedTextField(max_length=512)
    sent_at = models.DateTimeField(auto_now_add=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    read_by = models.ManyToManyField(User, blank=True, related_name='read_messages')

    def __str__(self):
        return self.sender.username + "'s message:" + str(self.id)