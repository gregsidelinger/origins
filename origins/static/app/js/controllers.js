'use strict';

/* Controllers */

var originsControllers = angular.module('originsControllers', []);

/*
 * Base controller
 */
originsControllers.controller('OriginsApplicationCtrl', function ($rootScope, $scope, Event, ){


});


originsControllers.controller('EventListCtrl', function ($rootScope, $scope, $uibModal, store, Event, initData) {

  $scope.view = "all_events"
  $scope.filters = {
    name: "",
    end_date: "",
    start_date: "",
    category: "",
    description: "",
    number: ""
  }
  $scope.minDate =  new Date(2018,5,13,8);
  $scope.maxDate =  new Date(2018,5,17,18);

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
   
    $scope.results = initData.results;
    $scope.count = initData.count;
    if (initData.next || initData.previous) {
      $scope.showPage = true;
    } else {
      $scope.showPage = false;
    }



  $scope.$on('events.query', function () {
    if($scope.view =="all_events"){
      Event.query({
        page: $scope.currentPage,
        search: $scope.search,
        number__icontains: $scope.filters.number,
        name__icontains: $scope.filters.name,
        category__icontains: $scope.filters.category,
        description__itcontains: $scope.filters.description,
        start_date__gte: $scope.filters.start_date,
        end_date__lte: $scope.filters.end_date
      }).$promise.then(function (data) {
          $scope.results = data.results;
          $scope.count = data.count;
          if (data.next || data.previous) {
            $scope.showPage = true;
          } else {
            $scope.showPage = false;
          }
      });

    } else if($scope.view =="distinctnames"){
      Event.distinctnames({
        page: $scope.currentPage,
        search: $scope.search,
        name__icontains: $scope.filters.name,
        category__icontains: $scope.filters.category
      }).$promise.then(function (data) {
          $scope.results = data.results;
          $scope.count = data.count;
          if (data.next || data.previous) {
            $scope.showPage = true;
          } else {
            $scope.showPage = false;
          }
      });

    } else if ($scope.view == "your_events") {
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
    console.debug($scope.view);
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

  $scope.showDistinctNameEvent = function(event) {
    console.debug("Looking up events for: " + event.name)
    $scope.view="all_events";

    Event.query({
      page: 1,
      name: event.name
    }).$promise.then(function (data) {
        $scope.results = data.results;
        $scope.count = data.count;
        if (data.next || data.previous) {
          $scope.showPage = true;
        } else {
          $scope.showPage = false;
        }
    });
  }

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

