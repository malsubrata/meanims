var app = angular.module('stockIn',['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('app',   {
        url:'/',
        views:  {
            'content':  {   
                templateUrl: '/angular_view/stock/in/list.html',
                controller: 'stockInlistCtrl'  
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
            var promise = $http.get('/update-stock/getItems/').then(function (response) {
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
app.controller('stockInlistCtrl', ['getAllItems', 'getAllItemsCategory', '$scope', '$rootScope', '$http', '$state', function(getAllItems, getAllItemsCategory, $scope, $rootScope, $http, $state) {
    $rootScope.addNew = false;
    getAllItems.getItems().then(function(data) {
        angular.forEach(data,function(item,key){
            if(item.stock_in.length == 0){
                if(item.stock_out.length == 0){
                    item.stock_in = {
                        item_id: item._id,
                        contracted_rate: item.item_rate,
                        reciving_rate: item.item_rate,
                        store_opn_qty: 0,
                        kitchen_opn_qty: 0,
                        purchage_qty : 0
                    }
                } else{
                    item.stock_in = {
                        item_id: item._id,
                        contracted_rate: item.item_rate,
                        reciving_rate: item.item_rate,
                        store_opn_qty: item.stock_out[0].store_close_qty,
                        kitchen_opn_qty: item.stock_out[0].kitchen_close_qty,
                        purchage_qty : 0
                    }
                }
            } else{
                item.stock_in = item.stock_in[0]
            }
        });
        $scope.allItems = data;
        console.log($scope.allItems);
    });
    getAllItemsCategory.getCategory().then(function(data){
        $scope.categories = data;
        $scope.category= $scope.categories[$scope.categories.length-1];
    });

    $scope.saveStockIn = function(index){
        $http.post('/update-stock/',$scope.allItems[index].stock_in).then(function(response){
            $state.reload();
        });
    }
    $scope.updateStockIn = function(index,_id){
        $http.put('/update-stock/'+_id,$scope.allItems[index].stock_in).then(function(response){
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
