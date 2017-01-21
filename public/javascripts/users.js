var app = angular.module('users',['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('app',   {
        url:'/',
        views:  {
            'content':  {   
                templateUrl: '/angular_view/users/user-list.html',
                controller: 'userlistsCtrl'  
            }
        }
    })
        .state('app.addUser', {
        url:'add-user',
        views:  {
            'content@':  {   
                templateUrl: '/angular_view/users/add_user.html',
                controller: 'AddUserCtrl'
            }
        }
    }).state('app.updateUser',{
        url: 'update-user:_id',
        views:  {
            'content@':  {   
                templateUrl: '/angular_view/users/update_user.html',
                controller: 'updateUserCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
}]);

/* get all Users */
app.factory('getAllUsers', function($http) {
    var getAllUsers = {
        getUsers: function() {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('/users/getAllUsers/').then(function (response) {
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        getUser: function(_id){
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('/users/getUserById/'+_id).then(function (response) {
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return getAllUsers;
});
/* Item list cntroller */
app.controller('userlistsCtrl', ['getAllUsers', '$scope', '$rootScope', '$location', '$http', function(getAllUsers, $scope, $rootScope, $location, $http) {
    $rootScope.addNew = false;
    getAllUsers.getUsers().then(function(data) {
        $scope.allUsers = data;
    });
    $scope.confirmDeleteUser = function(_id){
        $scope.userToBeDelete = _id;
    };
    $scope.deleteUser = function(){
        $http.delete('/users/deleteUser/'+$scope.userToBeDelete).then(function (response) {
            if(response){
                getAllUsers.getUsers().then(function(data) {
                    $scope.allUsers = data;
                });
            }
        });
    }
}]);

/* Add User cntroller */
app.controller('AddUserCtrl', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {
    $rootScope.addNew = true;
    $scope.addNewUser = function(isValid){
        if(isValid){
            $http.post('/users/createUser/',$scope.User).then(function (response) {
                if(response){
                    console.log(response);
                    $location.path('/')
                }
            });
        }
    }
}]);
/* Update user controller */
app.controller('updateUserCtrl',['getAllUsers', '$scope', '$rootScope', '$stateParams', '$http', '$location', function(getAllUsers,$scope, $rootScope,$stateParams, $http, $location){
    $rootScope.addNew = true;
    getAllUsers.getUser($stateParams._id).then(function(data){
        $scope.User = data;
        $scope.User.password = '';
    });
    $scope.updateUser = function(isValid){
        if(isValid){
            $http.post('/users/updateUser/',$scope.User).then(function (response) {
                console.log($scope.User);
                if(response){
                    console.log(response);
                    $location.path('/')
                }
            });
        }
    }
}]);