var app = angular.module("fetchApp", [
  'ngRoute',
  'ngSanitize',
  'fetchApp.controllers',
  'fetchApp.services',
]).config(['$routeProvider', '$locationProvider', 
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/topics/:topic/:start', {
        templateUrl: '/static/html/list.html',
        controller: 'mainController'
      })
      .when('/search/:query/:start', {
        templateUrl: '/static/html/list.html',
        controller: 'mainController'
      })
      .otherwise({
        redirectTo: '/topics/headlines/0/'
      });
    $locationProvider.html5Mode(true);
  }
]);