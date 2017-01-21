var app = angular.module('itemContracts',[]);

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
        }
    };
    return getAllItems;
});
app.controller('itemContractsCtrl', ['getAllItems', 'getAllVendor', '$scope', '$sce', function(getAllItems, getAllVendor, $scope, $sce) {
    getAllItems.getItems().then(function(data) {
        $scope.allItems = data;
    });
    getAllVendor.getVendors().then(function(data) {
        $scope.allVendors = data;
    });
    $scope.bindEditForm = function(id,name){
        $scope.cat_id = id;
        $scope.cat_name = name;
        $scope.action = $sce.trustAsUrl("/items/category/"+id);
    };
    $scope.conformDelete = function(id){
        $scope.cat_id = id;
        $scope.action = $sce.trustAsUrl("/items/category/"+id);
    }
}]);