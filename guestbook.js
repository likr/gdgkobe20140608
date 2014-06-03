var app = angular.module('guestbook', ['ngResource', 'ngRoute']);

app.factory('Greeting', function($resource) {
  return $resource('http://gdgkobe-ng-guestbook.appspot.com/greetings');
});

app.controller('TopController', function() {
});

app.controller('MainController', function($scope, Greeting, greetings) {
  $scope.greetings = greetings;
  $scope.newGreeting = new Greeting();

  $scope.submit = function() {
    $scope.newGreeting.$save(function(greeting){
      $scope.greetings.unshift(greeting);
      $scope.newGreeting = new Greeting({
        author: greeting.author
      });
      $scope.form.$setPristine(true);
    });
  };
});

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'TopController',
      templateUrl: 'partials/top.html'
    })
    .when('/greetings', {
      controller: 'MainController',
      templateUrl: 'partials/main.html',
      resolve: {
        greetings: function(Greeting) {
          return Greeting.query();
        }
      }
    })
    .otherwise({
      redirectTo: '/'
    });
});
