from django.db import models
from django.utils.translation import gettext_lazy as _

class Gender(models.TextChoices):
    GENDER_MALE = 'M', _('Male')
    GENDER_FEMALE = 'F', _('Female')
    GENDER_ANOTHER = 'A', _('Another')
    GENDER_NOT = 'N', _('Not say')
