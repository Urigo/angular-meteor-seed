

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
    // I wish we could bind only one object and put .find({}) in the HTML but it causes digest problems.
    // anyone has an idea? please pull request or message me..
    $scope.Todos = $meteor("todos");
    $scope.todos = $meteor("todos").find({});

    $scope.addTodo = function (newTodo) {
        $scope.Todos.insert({name: newTodo});
    };

    $scope.delete = function () {
        $scope.Todos.remove($scope.selected._id);
    };
}]);

app.controller('PartyCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
    //$scope.Parties = $meteor("parties");
    $scope.parties = $meteor("parties").find({});
}]);




