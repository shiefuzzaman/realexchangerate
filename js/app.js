// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    })
    .controller('realexchangeCtrl',function($scope,$filter,$ionicLoading,$http,$ionicPopup){
        $scope.Data={};
        $scope.Data.amount=1;
        $scope.Data.currentDate=$filter("date")(Date.now(),'yyyy-MM-dd');
        $scope.Data.date=$scope.Data.currentDate;

        var apiKey="your api key";
        var baseUrl="http://openexchangerates.org/api/";

        $scope.url=baseUrl+"latest.json?app_id="+apiKey;
        $ionicLoading.show();
        $http.get($scope.url)
            .success(function(response){
                $scope.result=response;
                fx.rates = response.rates;
                fx.base = response.base;
            })
            .error(function(response,status){
                $scope.showAlert('Error!!!',response.message);
            })
            .finally(function(){
                $ionicLoading.hide();
            });

        $scope.getExchangeRate = function() {

            if($scope.Data.date!=$scope.Data.currentDate)
            {
                $ionicLoading.show();
                $scope.url=baseUrl+"historical/"+$scope.Data.date+".json?app_id="+apiKey;

                $http.get($scope.url)
                    .success(function(response) {
                        $scope.historicalresult = response;
                        fx.rates = response.rates;
                        fx.base = response.base;
                        $scope.exchangeRate=fx($scope.Data.amount).from($scope.Data.fromCurrency).to($scope.Data.toCurrency).toFixed(2);
                    })
                    .error(function(response, status){
                        $scope.showAlert('Error!!!',response.message);
                    })
                    .finally(function(){
                        $ionicLoading.hide();
                    });
            }
            else{
                fx.rates = $scope.result.rates;
                fx.base = $scope.result.base;
                $scope.exchangeRate=fx($scope.Data.amount).from($scope.Data.fromCurrency).to($scope.Data.toCurrency).toFixed(2);
            }



        };
        $scope.doRefresh = function() {
            $http.get($scope.url)
                .success(function(response) {
                    $scope.result = response;
                    fx.rates = response.rates;
                    fx.base = response.base;
                })
                .finally(function() {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
        $scope.showAlert = function(alertTitle,alertTemplate) {
            var alertPopup = $ionicPopup.alert({
                title: alertTitle,
                template: alertTemplate
            });
            alertPopup.then(function(res) {
                console.log('Log Error');
            });
        };

})
