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

app.animation('.repeated-item', function() {
  return {
    enter : function(element, done) {
      element.css('opacity',0);
      jQuery(element).animate({
        opacity: 1
      }, done);

      // optional onDone or onCancel callback
      // function to handle any post-animation
      // cleanup operations
      return function(isCancelled) {
        if(isCancelled) {
          jQuery(element).stop();
        }
      }
    },
//    leave : function(element, done) {
//      element.css('opacity', 1);
//      jQuery(element).animate({
//        opacity: 0
//      }, done);
//
//      // optional onDone or onCancel callback
//      // function to handle any post-animation
//      // cleanup operations
//      return function(isCancelled) {
//        if(isCancelled) {
//          jQuery(element).stop();
//        }
//      }
//    },
    move : function(element, done) {
      element.css('opacity', 0);
      jQuery(element).animate({
        opacity: 1
      }, done);

      // optional onDone or onCancel callback
      // function to handle any post-animation
      // cleanup operations
      return function(isCancelled) {
        if(isCancelled) {
          jQuery(element).stop();
        }
      }
    },

    // you can also capture these animation events
    addClass : function(element, className, done) {},
    removeClass : function(element, className, done) {}
  }
});
/* get all Items */
app.factory('getAllItems', function($http) {
	var getAllItems = {
		getItems: function(date) {
			// $http returns a promise, which has a then function, which also returns a promise
			var promise = $http.get('/daily-report/getReport/'+date).then(function (response) {
				// The return value gets picked up by the then in the controller.
				return response.data;
			});
			// Return the promise to the controller
			return promise;
		}
	};
	return getAllItems;
});
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

app.controller('dailyReportCtrl', ['getAllItemsCategory', 'getAllItems', '$scope', '$rootScope', '$http', '$state', function(getAllItemsCategory, getAllItems, $scope, $rootScope, $http, $state) {
	$scope.cout = 1;
	$rootScope.currentDate = moment().format('ddd LL');
	$scope.date = moment().format();
	$rootScope.nextDate = function(){
		$rootScope.currentDate = moment().add($scope.cout, 'days').format('ddd LL');
		$scope.date = moment().add($scope.cout, 'days').format();
		$scope.cout++;
		$scope.bindReport();
	}
	$rootScope.prevDate = function(){
		$scope.cout--;
		$rootScope.currentDate = moment().add($scope.cout-1, 'days').format('ddd LL');
		$scope.date = moment().add($scope.cout-1, 'days', 'days').format();
		$scope.bindReport();
	}
	/* Bind Category */
	getAllItemsCategory.getCategory().then(function(data){
		$scope.categories = data;
		if (typeof(Storage) !== "undefined") {
			if(localStorage.getItem("category") !== "undefined"){
				$scope.category = JSON.parse(localStorage.getItem("category"));
			} else{
				$scope.category= $scope.categories[0];
			}
		} else{
			$scope.category= $scope.categories[0];
		}
	});
	/* Store category in localstorage */
	$scope.onChangeCategory = function(){
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("category", JSON.stringify($scope.category));
		}
	}
	/* Bind Items */
	$scope.bindReport = function(){
		getAllItems.getItems($scope.date).then(function(data) {
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
				/* stock outs */
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
			});
			$scope.allItems = data;
		});
	}
	$scope.bindReport();
}]);
