var app = angular.module('dailyReport',['ui.router','ngAnimate']);
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
    $scope.cout = 1;
    $rootScope.currentDate = moment().format('ddd LL');
    $scope.date = moment();
    $rootScope.nextDate = function(){
        $rootScope.currentDate = moment().add($scope.cout, 'days').format('ddd LL');
        $scope.date = moment().add($scope.cout, 'days');
        $scope.cout++;
    }
    $rootScope.prevDate = function(){
        $scope.cout--;
        $rootScope.currentDate = moment().add($scope.cout-1, 'days').format('ddd LL');
        $scope.date = moment().add($scope.cout-1, 'days', 'days');
    }
}]);
