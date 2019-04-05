from openpyxl import load_workbook
from origins.models import Event
import datetime


def run():
    events = set()
    print("Loading Origins Game Fair 2019 - Event Grid - Updated 4_4_19.xlsxinto DB")
    wb = load_workbook(filename='Origins Game Fair 2019 - Event Grid - Updated 4_4_19.xlsx', read_only=True)
    ws = wb.get_active_sheet()

    first_row = True
    counter = 1
    for row in ws.rows:
            if first_row:
                first_row = False
                continue
            try:
                fl
                event = Event.objects.get(number=row[2].value)
            except:
                #event = Event(number=row[0].value)
                print("New Event %s" % counter)
                event = Event(number=counter)
            #events.add(row[0].value)
            event.name = row[1].value
            if not event.name:
                continue
            event.description= row[3].value
            #'6/13/2018 12:00'
            event.start_date = row[4].value
            #event.end_date = row[4].value
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
            try:
                event.save()
                print("Saved %s name=%s" % (counter, event.name))
                counter += 1

            except:
                print("name=%s, description=%s, ", event.name, event.description)


    #for event in Event.objects.exclude(number__in=events):
    #    print("Removing Event %s - %s" % (event.number, event.name))
    #    event.delete()
