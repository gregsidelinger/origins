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
                print("New Event %s" % row[0].value)
            events.add(row[0].value)
            event.name = row[1].value
            event.description= row[2].value
            #'6/13/2018 12:00'
            event.start_date = row[3].value
            event.end_date = row[4].value
            event.category = row[6].value

            if type(row[9].value) is int:
                event.players = row[9].value
            else:
                event.players = 0
            if type(row[10].value) is int:
                event.price = row[10].value
            else:
                event.players = 0

            event.gaming_group = row[11].value or ""
            event.gamemaster = row[12].value or ""
            event.game_manufacture = row[13].value
            event.game_system = row[14].value
            event.save()


    #for event in Event.objects.exclude(number__in=events):
    #    print("Removing Event %s - %s" % (event.number, event.name))
    #    event.delete()
