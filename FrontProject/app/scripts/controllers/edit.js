'use strict';

/**
 * @ngdoc function
 * @name frontProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontProjectApp
 */
angular.module('frontProjectApp')
  .controller('EditCtrl', function ($scope, $routeParams,$location, RequestService) {

    var id = $routeParams.id;

    RequestService.getMusicById(id).success(function (data) {
      $scope.music = data;
    }).error(function (err) {
      console.log(err);
    });


    $scope.updateMusic = function (music){
      RequestService.updateMusic(music).success(function(data){
        console.log("Music Update",music);
        RequestService.updateMetaData(music).success(function(data){
            console.log("ici success");
        }).error(function (err){
            console.log("error : "+err);
        });
        $location.path("/music");
      }).error(function (err) {
        console.log("Erreur lors de la modification du mp3",err);
      });
    }

  });
