var app = angular.module('itemsCategory',[]);
app.controller('itemsCategoryCtrl', function($scope,$sce) {
    $scope.bindEditForm = function(id,name){
    	$scope.cat_id = id;
    	$scope.cat_name = name;
    	$scope.action = $sce.trustAsUrl("/items/category/"+id);
    };
    $scope.conformDelete = function(id){
    	$scope.cat_id = id;
    	$scope.action = $sce.trustAsUrl("/items/category/"+id);
    }
});