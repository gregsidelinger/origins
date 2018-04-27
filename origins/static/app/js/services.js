'use strict';

/* Services */


var eventServices = angular.module('eventServices', ['ngResource']);
eventServices.factory('Event', ['$resource',
  function ($resource) {
    return $resource(  'api/events/:eventId/', {
      eventId: '@eventId'
    }, {
        query: {
          url: 'api/events/',
          params: {
            id: '@eventId',
            page: '@pageNum',
            page_size: 20,
            search: '@search',
            name__icontains: '@name',
            category__icontains: '@category',
            description__icontains: '@description',
            start_date__gte: '@start_date',
            end_date__lte: '@end_date'
          },
          isArray: false
        }
      }, {
        stripTrailingSlashes: false
      });
  }
]);
