

var app = angular.module('meteorapp', ['ngRoute','meteor', 'ui', 'ui.state']);

app.config(['$routeProvider', '$stateProvider', function ($routeProvider, $stateProvider) {
    $stateProvider
        .state('/todos', {url:"/todos", templateUrl: 'partials/todos.html', controller: 'TodosCtrl'})
        .state('/editTodo/:todo_id', {url:"/editTodo/:todo_id", templateUrl: 'partials/editTodo.html', controller: 'EditTodoCtrl'})
        .state('/parties', {url:"/parties", templateUrl: 'partials/parties.html', controller: 'PartyCtrl'})
        .state('/nestedRouting',
        {url: "/nestedRouting", templateUrl: 'partials/nestedRouting.html', controller: 'NestedCtrl'})
        .state('/nestedRouting.next',
        {url: "/:userId", templateUrl: 'partials/nestedRouting.next.html', controller: 'NextCtrl'})
        .state('/layers',
        {url: "/:tubeUrl", templateUrl: 'partials/layers.html', controller: 'LayersCtrl'})
    ;
}]);

app.run(function () {
    var tag = document.createElement('script');

    // This is a protocol-relative URL as described here:
    //     http://paulirish.com/2010/the-protocol-relative-url/
    // If you're testing a local page accessed via a file:/// URL, please set tag.src to
    //     "https://www.youtube.com/iframe_api" instead.
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

app.service('youtubePlayerApi', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {
    var service = $rootScope.$new(true);

    // Youtube callback when API is ready
    $window.onYouTubeIframeAPIReady = function () {
        $log.info('Youtube API is ready');
        service.ready = true;
    };

    service.ready = false;
    service.playerId = null;
    service.player = null;
    service.videoId = null;
    service.playerHeight = '390';
    service.playerWidth = '640';

    service.bindVideoPlayer = function (elementId) {
        $log.info('Binding to player ' + elementId);
        service.playerId = elementId;
    };

    service.createPlayer = function () {
        $log.info('Creating a new Youtube player for DOM id ' + this.playerId + ' and video ' + this.videoId);
        return new YT.Player(this.playerId, {
            height: this.playerHeight,
            width: this.playerWidth,
            videoId: this.videoId
        });
    };

    service.loadPlayer = function () {
        // API ready?
        if (this.ready && this.playerId && this.videoId) {
            if(this.player) {
                this.player.destroy();
            }

            this.player = this.createPlayer();
        }
    };

    return service;
}]);

app.controller('MainCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
    $scope.mainMessage = "Main Controller scope message";
}]);

app.directive('youtubePlayer', ['youtubePlayerApi', function (youtubePlayerApi) {
    return {
        restrict:'A',
        link:function (scope, element) {
            youtubePlayerApi.bindVideoPlayer(element[0].id);
        }
    };
}]);

app.directive('sheker', function () {
    return  {
        replace: true,
        restrict: 'E',
        template: "<h1>bla!</h1>"
    };
});

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

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap($scope.myMap);


    $scope.loadDirections = function(){
        var start = "chicago, il";
        var end = "amarillo, tx";
        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
            durationInTraffic: true
        };
        directionsService.route(request, function(response, status) {
            console.log(response);
            console.log(status);
            if (status == google.maps.DirectionsStatus.OK) {
                $scope.duration = response.routes[0].legs[0].duration.text;
                $scope.polyline = response.routes[0].overview_path;
                console.log($scope.duration);
                directionsDisplay.setDirections(response);
            }
        });
    };

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

app.controller('NestedCtrl', ['$scope', '$meteor', function ($scope, $meteor) {

}]);

app.controller('NextCtrl', ['$scope', '$meteor', '$stateParams', function ($scope, $meteor, $stateParams) {
    $scope.userId = $stateParams.userId;
}]);

app.controller('LayersCtrl', ['$scope', '$meteor', function ($scope, $meteor, youtubePlayerApi) {
    if (youtubePlayerApi)
    {
        youtubePlayerApi.videoId = 'EKyirtVHsK0';
        //youtubePlayerApi.loadPlayer();
    }

    $scope.load = function(){
        //youtubePlayerApi.loadPlayer();
        $scope.videoSrc = 'www.youtube.com/watch?v=JmM_tUrwFZM';
    };

    $scope.videoSrc = "//www.youtube.com/embed/HKbc2B6vYis";
}]);

