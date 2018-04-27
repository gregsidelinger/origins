
import csv
from origins.models import Event
import datetime


def run():
    events = set()
    print("Loading Event-Sheet-4-23-18.csv into DB")
    with open('Event-Sheet-4-23-18.csv', encoding='mac_roman') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                event = Event.objects.get(number=row['Event #'])
            except:
                event = Event(number=row['Event #'])
            events.add(event.number)
            event.name = row['Event Name']
            event.description= row['Brief Description']
            #'6/13/2018 12:00'
            start_date = datetime.datetime.strptime(row['Event Start Date and Time'], '%m/%d/%Y  %H:%M')
            end_date = datetime.datetime.strptime(row['Event End Date and Time'], '%m/%d/%Y  %H:%M')
            event.start_date = start_date
            event.end_date = end_date
            event.category = row['Event Category']
            if row['Maximum Players for Event'].isdigit():
                event.players = row['Maximum Players for Event']
            else:
                event.players = 0
            if row['Price'].isdigit():
                event.price = row['Price']
            else:
                event.price = 0

            event.gaming_group = row['Company or Gaming Group']
            event.gamemaster = row['Game Master']
            event.game_manufacture = row['Game Manufacturer']
            event.game_system = row['Game System and Edition']


            event.save()

            # Event #,Event Name,Brief Description,Event Start Date and Time,Event End Date and Time,Event Duration,Event Category,Track,Ribbon,Maximum Players for Event,Price,Company or Gaming Group,Game Master,Game Manufacturer,Game System and Edition,Rules Taught?,Materials Provided?,Tournament Style,Tournament Round,Minimum Age,Game Complexity,Experience
