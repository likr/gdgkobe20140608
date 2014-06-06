var app = angular.module('guestbook', ['ngResource']);

app.factory('Greeting', function($resource) {
  return $resource('http://gdgkobe-ng-guestbook.appspot.com/greetings');
});

app.controller('MainController', function($scope, Greeting) {
  $scope.greetings = Greeting.query();

  $scope.newGreeting = new Greeting();

  $scope.submit = function() {
    $scope.newGreeting.$save(function(greeting) {
      $scope.greetings.unshift(greeting);
      $scope.newGreeting = new Greeting();
      $scope.form.$setPristine(true);
    });
  };
});
