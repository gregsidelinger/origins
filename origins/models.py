
from django.db import models


class Event(models.Model):
    number = models.IntegerField(unique=True)
    name = models.CharField(max_length=1024)
    description = models.CharField(max_length=1024)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    category = models.CharField(max_length=1024)
    players = models.IntegerField() 
    price = models.IntegerField() 


    gaming_group = models.CharField(max_length=1024)
    gamemaster = models.CharField(max_length=1024)
    game_manufacture = models.CharField(max_length=1024)
    game_system = models.CharField(max_length=1024)




    

