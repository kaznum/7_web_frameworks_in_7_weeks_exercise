var app = angular.module("BasicApp", []);

app.service("greeter", function () {
  this.name = "";
  this.greeting = function () {
    return (this.name) ? ("Hello, " + this.name + "!") : "";
  };
});

app.controller("BasicController", function ($scope, greeter) {
  $scope.greeter = greeter;
});

