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
				controller: 'AddItemCtrl'
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
    }
  };
  return getAllUsers;
});
/* Item list cntroller */
app.controller('userlistsCtrl', ['getAllUsers', '$scope', '$rootScope', function(getAllUsers, $scope, $rootScope) {
	$rootScope.addNew = false;
	getAllUsers.getUsers().then(function(data) {
		$scope.allUsers = data;
	});
}]);