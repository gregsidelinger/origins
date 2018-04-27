'use strict';

/* App Module */

var originsApp = angular.module('originsApp', [
  'ngRoute',
  'ui.bootstrap.modal',
  'ui.bootstrap',
  'moment-picker',
  'filters',

  'originsControllers',
  'eventServices',

  'angular-loading-bar', // progress bar
  'angular-storage',


]);

originsApp.config(['$routeProvider',
  function ($routeProvider) {
   $routeProvider.
      when('/', {
        templateUrl: 'static/app/partials/event-list.html',
        controller: 'EventListCtrl',
        resolve: {
          initData: function (Event) {
                      return Event.query({
                                page: 1,
                                search: ""
                             }).$promise
                               .then(function (data) {
                                   return data;
                            })
                      }
           }
      }).
      when('/applications/:applicationId/', {
        templateUrl: 'app/partials/application-detail.html',
        controller: 'ApplicationDetailCtrl',
        resolve: {
          application: function($route, Application) {
            return Application.get({ applicationId: $route.current.params.applicationId })
                              .$promise
                              .then(function (app) {
                                 return app;
                              })
          },
          jvmList: function ($route, JVM) {
            return JVM.query({ applicationId: $route.current.params.applicationId })
                      .$promise
                      .then(function (jvms) {
                        return jvms;
                      })
          }
        }
      })
  }
]);

originsApp.run(function ($rootScope, $location, $http, ) {

})


// angular-loading bar config
originsApp.config(function (cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.includeBar = true;
});

originsApp.config(function(storeProvider) {
    // Store defaults to localStorage but we can set sessionStorage or cookieStorage.
    storeProvider.setStore('localStorage');
});

// moment-picker config
originsApp.config(['momentPickerProvider', function (momentPickerProvider) {
  momentPickerProvider.options({
    /* Picker properties */
    locale: 'en',
    format: 'L LTS',
    minView: 'decade',
    maxView: 'minute',
    startView: 'year',
    autoclose: true,
    today: false,
    keyboard: false,

    /* Extra: Views properties */
    leftArrow: '&larr;',
    rightArrow: '&rarr;',
    yearsFormat: 'YYYY',
    monthsFormat: 'MMM',
    daysFormat: 'D',
    hoursFormat: 'HH:[00]',
    minutesFormat: moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
    secondsFormat: 'ss',
    minutesStep: 5,
    secondsStep: 1
  });
}]);

