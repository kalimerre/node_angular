'use strict';

/**
 * @ngdoc function
 * @name frontProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontProjectApp
 */
angular.module('frontProjectApp')
  .controller('ProfileCtrl', function ($scope, $routeParams, RequestService) {

    var id = $routeParams.id;


    RequestService.getMusicById(id).success(function (data) {
      $scope.music = data;
    }).error(function (err) {
      console.log(err);
    });

  });
