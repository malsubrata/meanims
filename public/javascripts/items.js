var app = angular.module('items',['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('app',   {
        url:'/',
        views:  {
            'content':  {   
                templateUrl: '/angular_view/items/item-list.html',
                controller: 'itemlistsCtrl'  
            }
        }
    })
        .state('app.addItem', {
        url:'add-item',
        views:  {
            'content@':  {   
                templateUrl: '/angular_view/items/add_item.html',
                controller: 'AddItemCtrl'
            }
        }
    }).state('app.updateItem', {
        url:'update-item:_id',
        views:  {
            'content@':  {   
                templateUrl: '/angular_view/items/update-item.html',
                controller: 'updateItemCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
}]);
/* get all product category */
app.factory('getAllItemsCategory', function($http) {
    var getAllItemsCategory = {
        getCategory: function() {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('/items/category/allcategory').then(function (response) {
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return getAllItemsCategory;
});
/* get all product UOM */
app.factory('getAllUOM', function($http) {
    var getAllUOM = {
        getUOM: function() {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('/items/uom/alluom').then(function (response) {
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return getAllUOM;
});
/* get all Items */
app.factory('getAllItems', function($http) {
    var getAllItems = {
        getItems: function() {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('/items/getAllItems/').then(function (response) {
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        getItem: function(_id){
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('/items/getItem/'+_id).then(function (response) {
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return getAllItems;
});
/* get vendor list */

app.factory('getAllVendor', function($http) {
    var getAllVendor = {
        getVendors: function() {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('/users/vendorlist/').then(function (response) {
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return getAllVendor;
});
/* Item list cntroller */
app.controller('itemlistsCtrl', ['getAllItems', '$scope', '$rootScope', '$http', function(getAllItems, $scope, $rootScope, $http) {
    $rootScope.addNew = false;
    getAllItems.getItems().then(function(data) {
        $scope.allItems = data;
    });
    $scope.confirmDeleteItem = function(_id){
        $scope.itemTodelete = _id;
    }
    $scope.deleteItem = function(){
        $http.delete('/items/deleteItem/'+$scope.itemTodelete).then(function (response) {
            if(response){
                getAllItems.getItems().then(function(data) {
                    $scope.allItems = data;
                });
            }
        });
    }
}]);
/* add new item controller */
app.controller('AddItemCtrl', ['getAllItemsCategory', 'getAllUOM', 'getAllVendor', '$http', '$scope','$rootScope', '$location', function(getAllItemsCategory, getAllUOM, getAllVendor,$http, $scope, $rootScope, $location) {
    $rootScope.addNew = true;
    getAllItemsCategory.getCategory().then(function(data) {
        $scope.allCategory = data;
    });
    getAllUOM.getUOM().then(function(data) {
        $scope.allUOM = data;
    });
    getAllVendor.getVendors().then(function(data) {
        $scope.allVendors = data;
    });
    $scope.addNewItem = function(isValid){
        if(isValid){
            $http.post('/items/createItem/',$scope.newItem).then(function (response) {
                if(response){
                    $location.path('/')
                }
            });
        } else{

        }
    }
}]);

app.controller('updateItemCtrl',['getAllItems','getAllItemsCategory', 'getAllUOM', 'getAllVendor', '$http', '$scope','$rootScope', '$location', '$stateParams', function(getAllItems,getAllItemsCategory, getAllUOM, getAllVendor,$http, $scope, $rootScope, $location, $stateParams){
    $rootScope.addNew = true;
    getAllItemsCategory.getCategory().then(function(data) {
        $scope.allCategory = data;
    });
    getAllUOM.getUOM().then(function(data) {
        $scope.allUOM = data;
    });
    getAllVendor.getVendors().then(function(data) {
        $scope.allVendors = data;
    });
    getAllItems.getItem($stateParams._id).then(function(data){
        $scope.Item = data;
    });
    $scope.updateItem = function(isValid){
        if(isValid){
            $http.put('/items/updateItem/'+$scope.Item._id,$scope.Item).then(function(response){
               if(response){
                   $location.path('/');
               } 
            });
        }
    }
}]);