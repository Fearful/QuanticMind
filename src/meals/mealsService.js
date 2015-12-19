(function(){
  'use strict';
  angular.module('quanticMind')
    .service('mealsService', ['$http', function($http){
        return {
            getMeals: function() {
              return $http.get('http://private-anon-5e680e468-foodorderapi.apiary-mock.com/meals').then(function(response) {
                return response.data;
              });
            }
        };
    }]);
})();