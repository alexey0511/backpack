var app = angular.module('login', ['ngRoute','ngSanitize', 'components', 'ngResource', 'ui.slider']);
// Page redirection
app.config(function($routeProvider, $httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $routeProvider.when('/login', {
        templateUrl: 'pages/login.html'
    });
    $routeProvider.when('/plans', {
        templateUrl: 'pages/tasks.html',
        controller: 'TasksController'
    });
    $routeProvider.when('/habits', {
        templateUrl: 'pages/habits.html',
        controller: 'HabitController'
    });
    $routeProvider.when("/habits/:id/", {
        templateUrl: "pages/habit.html",
        controller: "HabitController"});
    $routeProvider.when('/home', {
        templateUrl: 'pages/home.html',
        controller: 'HomeController'
    });
    $routeProvider.when('/profile', {
        templateUrl: 'pages/profile.html',
        controller: 'ProfileController'
    });

    $routeProvider.otherwise({redirectTo: '/login'});
});
