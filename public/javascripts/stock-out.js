var app = angular.module('stockOut',['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('app',   {
        url:'/',
        views:  {
            'content':  {
                templateUrl: '/angular_view/stock/out/list.html',
                controller: 'stockOutlistCtrl'
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

/* get all Items */
app.factory('getAllItems', function($http) {
    var getAllItems = {
        getItems: function() {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('/issue-items/getItems/').then(function (response) {
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return getAllItems;
});
/* Item list cntroller */
app.controller('stockOutlistCtrl', ['getAllItems', 'getAllItemsCategory', '$scope', '$rootScope', '$http', '$state', function(getAllItems, getAllItemsCategory, $scope, $rootScope, $http, $state) {
    $rootScope.addNew = false;
    getAllItems.getItems().then(function(data) {
        angular.forEach(data,function(item,key){
            if(item.stock_out.length == 0){
                item.stock_out = {
					item_id: item._id,
                    issue_qty: 0,
                    item_rate: item.item_rate,
                    store_close_qty: 0,
                    kitchen_close_qty: 0,
                }
            } else{
                item.stock_out = item.stock_out[0]
            }

            if(item.stock_in.length == 0){
                item.stock_in = {
                    purchage_qty: 0,
                    store_opn_qty: 0,
                    kitchen_opn_qty: 0,
                }
            } else{
                item.stock_in = item.stock_in[0]
            }
        });
        $scope.allItems = data;
    });
    
    getAllItemsCategory.getCategory().then(function(data){
        $scope.categories = data;
        if (typeof(Storage) !== "undefined") {
            if(localStorage.getItem("category") !== "undefined"){
                console.log(localStorage.getItem("category"));
                $scope.category = JSON.parse(localStorage.getItem("category"));
            } else{
                $scope.category= $scope.categories[0];
            }
        } else{
            $scope.category= $scope.categories[0];
        }
    });
    $scope.onChangeCategory = function(){
        console.log($scope.category);
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("category", JSON.stringify($scope.category));
        }
    }

    $scope.saveStockOut = function(item){
        $http.post('/issue-items/',item.stock_out).then(function(response){
            $state.reload();
        });
    }
    $scope.updateStockOut = function(item,_id){
        $http.put('/issue-items/'+_id,item.stock_out).then(function(response){
            $state.reload();
        });
    }
}]);
/* category wise filter */
app.filter('itemCategoryFilter',function(){
    return function( items, itemCategory_id) {
        var filtered = [];
        angular.forEach(items, function(item) {
            for(var i=0;i<item.item_cat_id.length;i++){
                if(itemCategory_id === item.item_cat_id[i]){
                    filtered.push(item);
                    continue;
                }
            }
        });
        return filtered;
    };
});
