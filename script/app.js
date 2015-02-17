var app = angular.module('app', ['autocomplete', 'angular.filter']);

// the service that retrieves some movie title from an url
app.factory('MovieRetriever', function ($http, $q, $timeout) {
    var MovieRetriever = new Object();

    MovieRetriever.getmovies = function (i) {
        var moviedata = $q.defer();

        var movies = [
            'Die Hard',
            'Terminator',
            'Star Wars',
            'Star Trek',
            'Harry Potter',
            'Narnia'
        ];

        $timeout(function () {
            moviedata.resolve(movies);
        }, 1000);

        return moviedata.promise
    };

    return MovieRetriever;
});

app.factory('MovieRetriever2', function ($http, $q, $timeout) {
    var MovieRetriever2 = new Object();

    MovieRetriever2.getmovies = function (i) {
        var moviedata = $q.defer();

        var movies = [
            {value: 'Die Hard', group: 'Action'},
            {value: 'Terminator', group: 'Action'},
            {value: 'Star Wars', group: 'Sci-Fi'},
            {value: 'Star Trek', group: 'Sci-Fi'},
            {value: 'Harry Potter', group: 'Kids'},
            {value: 'Narnia', group: 'Kids'}
        ];

        $timeout(function () {
            moviedata.resolve(movies);
        }, 1000);

        return moviedata.promise
    };

    return MovieRetriever2;
});

app.controller('MyCtrl', function ($scope, MovieRetriever, MovieRetriever2) {

    $scope.movies = MovieRetriever.getmovies("...");
    $scope.moviesByGenre = MovieRetriever2.getmovies("...");
    $scope.movies.then(function (data) {
        $scope.movies = data;
    });

    $scope.getmovies = function () {
        return $scope.movies;
    };

    $scope.doSomething = function (typedthings) {
        console.log("Do something like reload data with this: " + typedthings);
        $scope.newmovies = MovieRetriever.getmovies(typedthings);
        $scope.newmovies.then(function (data) {
            $scope.movies = data;
        });
    };

    $scope.doSomethingElse = function (suggestion) {
        console.log("Suggestion selected: " + suggestion);
    };

    $scope.getmovies2 = function(){
        return $scope.moviesByGenre;
    };

    $scope.doSomething2 = function(typedthings){
        console.log("Do something like reload data with this: " + typedthings);
        $scope.newmovies = MovieRetriever2.getmovies(typedthings);
        $scope.newmovies.then(function (data) {
            $scope.moviesByGenre = data;
        });
    };

    $scope.doSomethingElse2 = function (suggestion) {
        console.log("Suggestion selected: " + suggestion);
    };
});
