angular.module('frontProjectApp')
  .service('RequestService', function ($rootScope, $http) {

      var url = "http://localhost:1337/mp3";

      return {
        getUser: function getUser() {
          return $http.get(url);
        },
        getUserById: function getUserById(id) {
          return $http.get(url + "/" + id);
        }
        ,
        postUser: function postUser(user) {
          return $http.post(url + "/" + user.id, user);
        },
        deleteUser: function deleteUser(user) {
          return $http.delete(url + "/" + user.id, user)
        }
      };
    }
  );
