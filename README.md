## About
This is little Django Rest Framework API and an Angular site to view [Origins](http://originsgamefair.com/) events.  The data is stored in a sqlite DB that has been loaded from the most recent, `Event-Sheet-4-23-18.csv`, CSV file they provide on the site.

You can search and filter on most event data and even mark ones you are intested in to help plan a great gaming weekend.

### Run Natively

Install all python desp.  This should be done in a virtual env
`pip install -r requirements.txt`

Create initial database schema
`python manage.py migrate`

Load Origins CSV file. This will run scripts/load_csv.py and load `Event-Sheet-4-23-18.csv` from the current directory.
`python manage.py runscript load_csv`


Launch we server
`gunicorn -config gunicorn.conf origins.wsgi`



### Run in Docker
This will run all of the commands in the Native section but inside a container 
```
docker build . -t origins
docker run -p 8080:8080 origins
```

or you can download the image from the Google registry and not build your own..

`docker run -i gcr.io/origins-202415/origins:latest`



