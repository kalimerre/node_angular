angular.module('frontProjectApp')
  .service('RequestService', function ($rootScope, $http) {

      var url = "http://localhost:1337/mp3";

      return {
        getMusic: function getMusic() {
          return $http.get(url);
        },
        getMusicById: function getMusicById(id) {
          return $http.get(url + "/" + id);
        }
        ,
        deleteMusic: function deleteMusic(music) {
          return $http.delete(url + "/" + music.id, music)
        },
        updateMusic:function updateMusic(music){
          return $http.put(url + "/" + music.id, music)
        }
      };
    }
  );
