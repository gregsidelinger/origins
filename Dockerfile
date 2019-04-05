#FROM python:3
FROM python:alpine
EXPOSE 8080

WORKDIR /opt/origins

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py migrate

#RUN apk add wget \
#    && wget http://originsgamefair.com/wp-content/uploads/Event-Sheet-4-23-18.csv \
#    && python manage.py runscript load_csv \
#    && rm *.csv

#RUN python manage.py runscript load_csv
RUN python manage.py runscript load_xlsx_2019

CMD [ "gunicorn", "--config", "/opt/origins/gunicorn.conf", "origins.wsgi" ]
