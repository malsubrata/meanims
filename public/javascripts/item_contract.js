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
/* get Contract */
app.factory('getContract', function($http) {
    var getContract = {
        get: function(_id) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('/items/getContract/'+_id).then(function (response) {
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return getContract;
});
app.controller('itemContractsCtrl', ['getAllItems', 'getContract', 'getAllVendor', '$scope', '$sce', '$filter', function(getAllItems, getContract, getAllVendor, $scope, $sce, $filter) {
    getAllItems.getItems().then(function(data) {
        $scope.allItems = data;
    });
    getAllVendor.getVendors().then(function(data) {
        $scope.allVendors = data;
    });
    $scope.conformDelete = function(_id){
        $scope.action = $sce.trustAsUrl("/items/contract/"+_id);
    }
    $scope.bindEditForm = function(_id){
        getContract.get(_id).then(function(data){
            $scope.contract = data;
            $scope.contract.start_date = new Date($scope.contract.start_date);
            $scope.contract.end_date = new Date($scope.contract.end_date);
            $scope.action = $sce.trustAsUrl("/items/contract/"+_id);
        });
    }
}]);