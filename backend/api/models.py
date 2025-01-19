from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class SystemUser(AbstractUser):

    email = models.EmailField(unique=True) 
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set", 
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",  
        blank=True,
    )
    favorites = models.ManyToManyField(
        'Add', 
        related_name='favorited_by', 
        blank=True
    ) 

class Add(models.Model):
    subject = models.CharField(max_length=100)
    description = models.TextField()
    level = models.CharField(max_length=50, blank=True, null=True)
    learning_mode = models.CharField(max_length=50)
    frequency = models.CharField(max_length=50, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    username = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return self.subject
