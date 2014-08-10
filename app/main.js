var app = angular.module('better-you', [
    'general-module',
    'goals-module',
    'components',
    'ngRoute',
    'ngResource',
    'ngProgress',
    'ui.bootstrap',
    'ngDialog',
    'ngCookies',
    'ui.slider'
]);


app.constant('appConfig', {
    DbId: 'Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo',
    fbId: '1526114560951318',
    DbPath: 'better-you/collections/',
    DbUrl: 'https://api.mongolab.com/api/1/databases/'
}
);
// Page redirection

  //// end test
app.config(function($routeProvider, $httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $routeProvider.when('/loading', {
        templateUrl: 'modules/general/loading.html',
        controller: 'loadingController'
    });
    $routeProvider.when('/login', {
        templateUrl: 'modules/general/login.html',
        controller: 'loginController'
    });
    $routeProvider.when('/goals', {
        templateUrl: 'modules/goals/goals.html',
        controller: 'goalsController'
    });
    $routeProvider.when('/habits', {
        templateUrl: 'modules/habits/habits.html',
        controller: 'habitsController'
    });
    $routeProvider.when("/habits/:id/", {
        templateUrl: "modules/habit.html",
        controller: "habitsController"});
    $routeProvider.when('/home', {
        templateUrl: 'modules/general/home.html',
        controller: 'homeController'
    });
    $routeProvider.when('/challenges', {
        templateUrl: 'modules/challenges/challenges.html',
        controller: 'challengesController'
    });
    $routeProvider.when('/profile', {
        templateUrl: 'modules/general/profile.html',
        controller: 'profileController'
    });

    $routeProvider.otherwise({redirectTo: '/loading'});
});

