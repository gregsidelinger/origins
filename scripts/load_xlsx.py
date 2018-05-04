from openpyxl import load_workbook
from origins.models import Event
import datetime


def run():
    events = set()
    print("Loading 5-2-18.xlsx into DB")
    wb = load_workbook(filename='5-2-18.xlsx', read_only=True)
    ws = wb.get_active_sheet()

    first_row = True
    for row in ws.rows:
            if first_row:
                first_row = False
                continue
            try:
                event = Event.objects.get(number=row[0].value)
            except:
                event = Event(number=row[0].value)
            events.add(row[0].value)
            event.name = row[1]
            event.description= row[2]
            #'6/13/2018 12:00'
            event.start_date = row[3].value
            event.end_date = row[4].value
            event.category = row[6]
            event.players = row[9].value
            event.price = row[10]

            event.gaming_group = row[11]
            event.gamemaster = row[12]
            event.game_manufacture = row[13]
            event.game_system = row[14]


    for event in Event.objects.exclude(number__in=events).order_by('number'):
        print("Removing Event %s - %s", % (event.number, event.name))
        event.delete()
