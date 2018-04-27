'use strict';

/* Controllers */

var originsControllers = angular.module('originsControllers', []);

/*
 * Base controller
 */
originsControllers.controller('OriginsApplicationCtrl', function ($rootScope, $scope, Event, ){


});


originsControllers.controller('EventListCtrl', function ($rootScope, $scope, $uibModal, store, Event, initData) {

	$scope.switch_button = "Show Your Events";
    $scope.all_events = true;
    $scope.your_events = false;

	var origins_events = store.get('origins_events');
    console.debug(origins_events);
	if(origins_events == null){
        console.debug("Creating new origins_events");
		$scope.origins_events = new Set([]);
	} else {
        console.debug("Loading: origins_events");
        console.debug(origins_events);
		$scope.origins_events = new Set(origins_events);
    } 
    console.debug($scope.origins_events);
   
    $scope.results = initData.results;
    $scope.count = initData.count;
    if (initData.next || initData.previous) {
      $scope.showPage = true;
    } else {
      $scope.showPage = false;
    }


	$scope.end_date = "";
	$scope.start_date = "";
	$scope.name_filter = "";
	$scope.category_filter= "";
	$scope.description_filter= "";
  $scope.number_filter = "";
  $scope.minDate =  new Date(2018,5,13,8);
  $scope.maxDate =  new Date(2018,5,17,18);

  $scope.$on('events.query', function () {
    if($scope.all_events){
      Event.query({
        page: $scope.currentPage,
        search: $scope.search,
        number__icontains: $scope.number_filter,
        name__icontains: $scope.name_filter,
        category__icontains: $scope.category_filter,
        description__itcontains: $scope.description_filter,
        start_date__gte: $scope.start_date,
        end_date__lte: $scope.end_date
      }).$promise.then(function (data) {
          $scope.results = data.results;
          $scope.count = data.count;
          if (data.next || data.previous) {
            $scope.showPage = true;
          } else {
            $scope.showPage = false;
          }
      });
    } else {
      $scope.results = []
      $scope.showPage = false;
      angular.forEach($scope.origins_events, function(item){
        Event.query({
          number: item
        }).$promise.then(function (data) {
          $scope.results.push(data.results[0]);
        });
        console.debug($scope.results);
      });
    }
  });

  $scope.filterEvents = function () {
    console.debug("filterEvents");
    $scope.currentPage = 1;
    $scope.search = angular.copy($scope.filter);
    $scope.$broadcast("events.query");
  }

  $scope.pageChanged = function () {
    console.log('Page changed to: ' + $scope.currentPage);
    $scope.$broadcast("events.query");

  };

  $scope.clearFilter = function () {
    $scope.currentPage = 1;
    $scope.search = '';
    $scope.filter = '';
    $scope.$broadcast("events.query");
  }


  $scope.showEvent = function(data) {
    console.debug("showEvent");
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'static/app/partials/event-detail.html',
      controller: 'EventDetailCtrl',
      backdrop: 'static',
      size: 'lg',
      resolve: { event: data, origins_events: $scope.origins_events }
    })
  }

  $scope.switch_view= function() {
    console.debug("switch_view");
    if($scope.all_events){
      $scope.all_events = false;
      $scope.your_events = true;
      $scope.switch_button = "Show All Events";
    } else {
      $scope.all_events = true;
      $scope.your_events = false;
      $scope.switch_button = "Show Your Events";
    }
    $scope.$broadcast("events.query");
  }

  $scope.save = function(event) {
    origins_events.add(event)
    console.debug(origins_events);
    store.set('origins_events', Array.from(origins_events));
  };

  $scope.remove = function(event) {
    origins_events.delete([event.number]);
    console.debug(origins_events);
    store.set('origins_events', Array.from(origins_events));
  };

})

originsControllers.controller('EventDetailCtrl',
function ($scope, $uibModalInstance, store, origins_events, event) {
  $scope.event = event;
  $scope.origin_events = origins_events;

  $scope.close = function close() {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.save = function(event) {
    origins_events.add(event)
    console.debug(origins_events);
    store.set('origins_events', Array.from(origins_events));
    $scope.$emit("events.query");

  };

  $scope.remove = function(event) {
    origins_events.delete(event);
    console.debug(origins_events);
    store.set('origins_events', Array.from(origins_events));
    $scope.$broadcast("events.query");

  };

});

