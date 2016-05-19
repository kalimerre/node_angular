'use strict';

/**
 * @ngdoc function
 * @name frontProjectApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontProjectApp
 */
angular.module('frontProjectApp')
  .controller('AboutCtrl', function ($http, $scope, $location, RequestService) {


    RequestService.getUser().success(function (data) {
      $scope.users = data;
    }).error(function (err) {
      console.log(err);
    });


    $scope.onRemove = function (user) {
      RequestService.deleteUser(user).success(function () {


        for (var i = 0; i < $scope.users.length; i++) {
          if ($scope.users[i].id == user.id) {
            $scope.users.splice(i, 1);
          }
        }

        console.log("user delete");
      }).error(function (err) {
        console.log(err);
      });

    }

    $scope.onEdit = function (user) {
      $location.path("/profile/" + user.id);
      //$scope.editUser = angular.copy(user);
    }

    $scope.onProfil = function (user) {

      console.log(user);

      $location.path("/")
    }

  });
