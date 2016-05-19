angular.module('frontProjectApp')
  .service('RequestService', function ($rootScope, $http) {

      var url = "http://localhost:1337/mp3";

      return {
        getMusic: function getUser() {
          return $http.get(url);
        },
        getMusicById: function getUserById(id) {
          return $http.get(url + "/" + id);
        }
        ,
        deleteMusic: function deleteUser(user) {
          return $http.delete(url + "/" + user.id, user)
        }
      };
    }
  );
