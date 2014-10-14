angular.module('fetchApp.controllers', [])
.controller(
  'mainController', 
  ['$scope', 'ws', '$route', 'topics', '$routeParams', '$location',
    function($scope, ws, $route, topics, $routeParams, $location) {
      // set the scope variables
      $scope.topics = topics;
      $scope.currentTopic = $routeParams['topic'];
      $scope.query = $routeParams['query'] || '';
      $scope.start = $routeParams['start'];
      $scope.isError = false;
      $scope.isWaiting = true;

      // set the request for the query to the proxy server
      var topicSymbol = topics[$routeParams['topic']];
      var start = parseInt($routeParams['start']);
      var search_query = $routeParams['query'];
      $scope.request = {
        topic: topicSymbol ? topicSymbol : undefined,
        start: start ? start : undefined, 
        q: search_query ? search_query : undefined,
      };
      var requestSent = false;

      // send the request if the web socket is already connected
      if (ws.readyState) {
        ws.send(JSON.stringify($scope.request));
        requestSent = true;
      }

      // this event will only trigger on the initial page load
      ws.onopen = function() {
        if (!requestSent) {
          ws.send(JSON.stringify($scope.request));
          requestSent = true;
        }
      }

      // handle the incoming messages
      ws.onmessage = function(message) {
        $scope.$apply(function() {
          var result = JSON.parse(message.data);

          // if this result is not for the latest request, then ignore it
          if (!angular.equals($scope.request, result.request)) {
            console.log('Warning: Response to old request');
            return;
          }

          // the api call failed
          if (result.response.responseStatus !== 200) {
            console.log('Error: ' + result.response.responseDetails);
            $scope.isError = true;
            $scope.isWaiting = false;
            return;
          }

          $scope.results = result.response.responseData.results;
          $scope.pages = result.response.responseData.cursor.pages;
          $scope.isError = false;
          $scope.isWaiting = false;
        });
      }

      // helper to get the keys of an object with the default ordering
      $scope.notSorted = function(obj){
        if (!obj) {
          return [];
        }
        return Object.keys(obj);
      }

      // helper used by the search box
      $scope.submit = function() {
        if ($scope.query == '') {
          return;
        }
        $location.url(
          '/search/' + $scope.query + '/0/'
        );
      }

      // helper used for obtaining the page link
      $scope.getPageUrl = function(start) {
        if ($scope.currentTopic) {
          return '/topics/' + $scope.currentTopic + '/' + start;
        }
        return '/search/' + $scope.query + '/' + start;
      }
    }
  ]
);