

var app = angular.module('meteorapp', ['meteor']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/todos', {templateUrl: 'partials/todos.html', controller: 'TodosCtrl'})
        .when('/parties', {templateUrl: 'partials/parties.html', controller: 'PartyCtrl'})
    ;
}]);

app.controller('MainCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
    $scope.mainMessage = "Main Controller scope message";
}]);

app.controller('TodosCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
    $scope.Todos = $meteor("todos");
    $scope.todos = $meteor("todos").find({});
}]);

app.controller('PartyCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
    $scope.Parties = $meteor("parties");
    $scope.parties = $meteor("parties").find({});
}]);




