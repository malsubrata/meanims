var app = angular.module('dailyReport',['ui.router']);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('app',   {
        url:'/',
        views:  {
            'content':  {   
                templateUrl: '/angular_view/report/daily.html',
                controller: 'dailyReportCtrl'  
            }
        }
    });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
}]);

app.controller('dailyReportCtrl', ['$scope', '$rootScope', '$http', '$state', function($scope, $rootScope, $http, $state) {
    $rootScope.currentDate = new Date().toDateString(); 
    $rootScope.nextDate = function(){
        $rootScope.currentDate = new Date().setDate(new Date() + 1);
        console.log($rootScope.currentDate);
    }
}]);
