'use strict';

/**
 * @ngdoc function
 * @name frontProjectApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontProjectApp
 */
angular.module('frontProjectApp')
  .controller('AboutCtrl', function ($http,$scope) {

  $http.get("http://localhost:1337/user").success(function(data){
    $scope.users = data;
  });


    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
