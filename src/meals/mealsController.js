(function(){
  'use strict';
  angular.module('quanticMind')
    .controller('mealsCtrl', ['$scope', 'mealsService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', function($scope, mealsService, $mdSidenav, $mdBottomSheet, $log, $q){
      mealsService
          .getMeals()
          .then( function(data) {
            $scope.meals = [].concat(data.meals);
          });
      $scope.order = {
        nutrition: {
          "Calories": 0,
          "Total Fat": 0,
          "Cholesterol": 0
        },
        items: [],
        total: 0
      }
      function updateValues(){
        if(!$scope.order.items.length > 0){
          $scope.order.nutrition["Calories"] = 0;
          $scope.order.nutrition["Total Fat"] = 0;
          $scope.order.nutrition["Cholesterol"] = 0;
          $scope.order.total = 0;
          return;
        }
        var totalCal = 0, totalFat = 0, totalChol = 0, totalPrice = 0;
        for (var i = $scope.order.items.length - 1; i >= 0; i--) {
          totalCal = totalCal + $scope.order.items[i].calories * $scope.order.items[i].qty;
          totalFat = totalFat + $scope.order.items[i].total_fat * $scope.order.items[i].qty;
          totalChol = totalChol + $scope.order.items[i].cholesterol * $scope.order.items[i].qty;
          totalPrice = totalPrice + $scope.order.items[i].price * $scope.order.items[i].qty;
        };
        $scope.order.nutrition["Calories"] = totalCal;
        $scope.order.nutrition["Total Fat"] = totalFat;
        $scope.order.nutrition["Cholesterol"] = totalChol;
        $scope.order.total = totalPrice.toFixed(2);
      };
      $scope.toggleOrder = function(){
        var pending = $mdBottomSheet.hide() || $q.when(true);
        pending.then(function(){
          $mdSidenav('left').toggle();
        });
      }
      $scope.addToOrder = function(meal){
        var exists = false;
        var indexFound;
        for (var i = $scope.order.items.length - 1; i >= 0; i--) {
          if($scope.order.items[i].id == meal.id){
            exists = true;
            indexFound = i;
          }
        };
        if(exists){
          $scope.order.items[indexFound].qty++;
        } else {
          meal.qty = 1;
          $scope.order.items.push(meal);
        }
        updateValues();
      };
      $scope.deleteItem = function(meal){
        for (var i = $scope.order.items.length - 1; i >= 0; i--) {
          if($scope.order.items[i].id == meal.id){
            if($scope.order.items[i].qty > 1){
              $scope.order.items[i].qty--;
            } else {
              if($scope.order.items.length > 1){
                $scope.order.items.splice(i, 1);
              } else {
                $scope.order.items = [];
              }
            }
            updateValues();
            return;
          }
        };
      }
    }]);
})();