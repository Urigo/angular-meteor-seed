

var app = angular.module('meteorapp', ['meteor', 'ui']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/todos', {templateUrl: 'partials/todos.html', controller: 'TodosCtrl'})
        .when('/editTodo/:todo_id', {templateUrl: 'partials/editTodo.html', controller: 'EditTodoCtrl'})
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

    $scope.addTodo = function () {
        $scope.Todos.insert({name: $scope.newTodo, done: false});
        $scope.newTodo = '';
    };

    $scope.archive = function() {
        angular.forEach($scope.todos, function(todo) {
            if (todo.done){
                console.log(todo);
                $scope.Todos.remove(todo._id);
            }
        });
    };

    $scope.remaining = function() {
        var count = 0;
        angular.forEach($scope.todos, function(todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

}]);

app.controller('EditTodoCtrl', ['$scope', '$meteor', '$routeParams', '$location',
    function ($scope, $meteor, $routeParams, $location) {
    $scope.todos = $meteor("todos");
    $scope.todo = $scope.todos.findOne($routeParams.todo_id);

    $scope.destroy = function() {
        $scope.todos.remove($scope.todo._id);
        $location.path('/todos');
    };

    $scope.save = function() {
        $scope.todos.update($scope.todo._id, {name: $scope.todo.name});
        $location.path('/todos');
    };
}]);

app.controller('PartyCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
    //$scope.Parties = $meteor("parties");
    $scope.parties = $meteor("parties").find({});

    $scope.myMarkers = [];

    $scope.mapOptions = {
        center: new google.maps.LatLng(35.784, -78.670),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.addMarker = function($event) {
        $scope.myMarkers.push(new google.maps.Marker({
            map: $scope.myMap,
            position: $event.latLng
        }));
    };

    $scope.setZoomMessage = function(zoom) {
        $scope.zoomMessage = 'You just zoomed to '+zoom+'!';
        console.log(zoom,'zoomed')
    };

    $scope.openMarkerInfo = function(marker) {
        $scope.currentMarker = marker;
        $scope.currentMarkerLat = marker.getPosition().lat();
        $scope.currentMarkerLng = marker.getPosition().lng();
        $scope.myInfoWindow.open($scope.myMap, marker);
    };

    $scope.setMarkerPosition = function(marker, lat, lng) {
        marker.setPosition(new google.maps.LatLng(lat, lng));
    };
}]);



