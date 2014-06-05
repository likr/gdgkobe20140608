var app = angular.module('guestbook', []);

app.controller('MainController', function($scope) {
  $scope.greetings = [
    {author: 'おのうえ', content: 'こんにちは'},
    {author: 'おのうえ', content: 'はろー'},
    {author: 'いまい', content: 'Python最高！'},
    {content: 'こんにちは'}
  ];
});
