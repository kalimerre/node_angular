'use strict';

/**
 * @ngdoc function
 * @name frontProjectApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontProjectApp
 */
angular.module('frontProjectApp')
  .controller('MusicCtrl', function ($http, $scope, $location, RequestService,$timeout,$sce) {

    /*
    setTimeout(function(){
      window.location.reload(1);
    }, 10000);*/


    $scope.musicSelected = function(music){
      console.log("Ma musique",music);
      $scope.musicChoisis = $sce.trustAsResourceUrl("http://localhost:1337" + music.pathDatabase.substr(1));
    }

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

        $scope.deleteMessage=true;
          $timeout(function () { $scope.deleteMessage = false; }, 3000);

      }).error(function (err) {
        console.log(err);
      });

    };

    $scope.onEdit = function (music) {
      console.log(music);
      $location.path("/edit/" + music.id);
      //$scope.editUser = angular.copy(user);
    };

    $scope.onProfil = function (music) {

      console.log(music);

      $location.path("/")
    }

  });
