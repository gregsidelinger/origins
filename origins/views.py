from rest_framework import serializers
from rest_framework import viewsets, filters
from rest_framework import pagination
from rest_framework.decorators import action
from drf_dynamic_fields import DynamicFieldsMixin
from django_filters.rest_framework import DjangoFilterBackend
#from django.views.generic.list import ListView
from django_filters.views import FilterView
import django_filters

from .models import *



class EventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ('__all__')

class EventNameOnlySerializer(serializers.Serializer):
    name = serializers.CharField()
    class Meta:
        fields = ('__all__')

class CustomPageNumberPagination(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000

class EventFilter(DynamicFieldsMixin, django_filters.FilterSet):
    class Meta:
        model = Event
        fields = {
            'number': ['exact', 'icontains'],
            'name': ['exact', 'icontains'],
            'category': ['exact', 'icontains'],
            'start_date': ['exact', 'gte'],
            'end_date': ['exact', 'lte'],
        }

class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows events to be viewed or edited.
    """
    pagination_class = CustomPageNumberPagination
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = (filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter,)
    filter_class = EventFilter
    #filter_fields = ('number', 'name', 'description', 'start_date', 'end_date', 'category', 'players', 'price',)
    search_fields = ('number', 'name', 'description')
    ordering_fields = ('number', 'name', 'description', 'start_date', 'end_date', 'category', 'players', 'price',)
    ordering = ('start_date', 'number')

    @action(detail=False)
    def distinctnames(self, request):
        """ Return a list of distint event names """
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset);
        queryset = queryset.values('name').distinct().order_by('name')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = EventNameOnlySerializer(page,  many=True)
            return self.get_paginated_response(serializer.data)

        serializer = EventNameOnlySerializer(queryset, many=True)
        return Response(serializer.data)

