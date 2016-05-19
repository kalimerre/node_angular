'use strict';

/**
 * @ngdoc function
 * @name frontProjectApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontProjectApp
 */
angular.module('frontProjectApp')
  .controller('MusicCtrl', function ($http, $scope, $location, RequestService) {


    RequestService.getMusic().success(function (data) {
      $scope.musics = data;
    }).error(function (err) {
      console.log(err);
    });


    $scope.onRemove = function (music) {
      RequestService.deleteMusic(music).success(function () {
        for (var i = 0; i < $scope.musics.length; i++) {
          if ($scope.musics[i].id == music.id) {
            $scope.musics.splice(i, 1);
          }
        }
        console.log("user delete");
      }).error(function (err) {
        console.log(err);
      });

    };

    $scope.onEdit = function (music) {
      console.log(music);
      $location.path("/profile/" + music.id);
      //$scope.editUser = angular.copy(user);
    };

    $scope.onProfil = function (music) {

      console.log(music);

      $location.path("/")
    }

  });
