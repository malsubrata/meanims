var app = angular.module("dashboard", ["chart.js"]);
app.controller("stockReoportCtrl", function ($scope) {
  $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "dda", "dsadsa","Download Sales", "In-Store Sales", "Mail-Order Sales", "dda", "dsadsa"];
  $scope.data = [300, 500, 100, 200, 300, 300, 500, 100, 200, 0];
});