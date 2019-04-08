#FROM python:3
FROM python:alpine
EXPOSE 8080

WORKDIR /opt/origins

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py migrate

RUN apk add curl \
    && curl "https://docs.google.com/spreadsheets/d/1b2yJW-vDf7VG_aHPUyRFphESVHReXEXexfSF1YPy3XM/export?gid=0&format=xlsx" -o  events.xlsx \
    && python manage.py runscript load_xlsx_2019
#    && rm *.csv

#RUN python manage.py runscript load_csv
#RUN python manage.py runscript load_xlsx_2019

CMD [ "gunicorn", "--config", "/opt/origins/gunicorn.conf", "origins.wsgi" ]
