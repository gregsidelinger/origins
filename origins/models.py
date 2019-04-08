
from django.db import models


class Event(models.Model):
    number = models.IntegerField(unique=True, null=True, blank=True)
    name = models.CharField(max_length=1024)
    description = models.CharField(max_length=1024)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    
    category = models.CharField(max_length=1024, null=True, blank=True)
    players = models.IntegerField(null=True, blank=True)
    price = models.IntegerField(null=True, blank=True)


    gaming_group = models.CharField(max_length=1024, null=True, blank=True)
    gamemaster = models.CharField(max_length=1024, null=True, blank=True)
    game_manufacture = models.CharField(max_length=1024, null=True, blank=True)
    game_system = models.CharField(max_length=1024, null=True, blank=True)




    

