var app = angular.module('better-you', [
    'ngAnimate',
    'general-module',
    'goals-module',
    'directives',
    'ngRoute',
    'ngResource',
    'angular-loading-bar',
    'ui.bootstrap',
    'ngDialog',
    'ngCookies',
]);

// Page redirection
app.config(function ($routeProvider, $httpProvider) {
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
    $routeProvider.when('/goals/years', {
        templateUrl: 'modules/goals/goals.html',
        controller: 'goalsController'
    });
    $routeProvider.when('/goals/months', {
        templateUrl: 'modules/goals/goals.html',
        controller: 'goalsController'
    });
    $routeProvider.when('/goals/weeks', {
        templateUrl: 'modules/goals/goals.html',
        controller: 'goalsController'
    });
    $routeProvider.when('/news', {
        templateUrl: 'modules/general/news.html',
        controller: 'generalController'
    });
    $routeProvider.when('/activities', {
        templateUrl: 'modules/general/activities.html',
        controller: 'generalController'
    });
    $routeProvider.when('/guide/step-1', {
        templateUrl: 'modules/general/guide/step_1.html',
        controller: 'generalController'
    });
    $routeProvider.when('/guide/step-2', {
        templateUrl: 'modules/general/guide/step_2.html',
        controller: 'generalController'
    });
    $routeProvider.when('/guide/step-3', {
        templateUrl: 'modules/general/guide/step_3.html',
        controller: 'generalController'
    });
    $routeProvider.when('/guide/step-0', {
        templateUrl: 'modules/general/guide/step_0_slide.html',
        controller: 'generalController'
    });
    $routeProvider.when("/goals/:id/", {
        templateUrl: "modules/goals/editTaskDialog.html",
        controller: "taskDialogController"});
    $routeProvider.when('/home', {
        templateUrl: 'modules/general/home.html',
        controller: 'homeController'
    });
    $routeProvider.when('/profile', {
        templateUrl: 'modules/general/profile.html',
        controller: 'profileController'
    });
    $routeProvider.when('/logout', {
        templateUrl: 'modules/general/logout.html',
        controller: 'generalController'
    });
    $routeProvider.when('/tc', {
        templateUrl: 'modules/general/tc.html',
        controller: 'tcCtrl'
    });
    $routeProvider.when('/feedback', {
        templateUrl: 'modules/general/feedback.html',
    });
    $routeProvider.otherwise({redirectTo: '/'});
});

// CONSTANTS
app.constant('appConfig', {
    DbId: 'Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo',
    fbId: '1526114560951318',
    fbName: 'betterYou',
    DbPath: 'better-you/collections/',
    DbUrl: 'https://api.mongolab.com/api/1/databases/'
}
);
// CONTROLLERS

app.controller('mainController', function (appConfig, lsService, $scope, $rootScope, dataService,
        RouteFilter, dateService, FBService, $q, $location, Application, $cookieStore, userService, goalsService, sessionService)
{
    console.log("0. Start Application");

// Initialize variables
// Dates that will be reused by programm
    $rootScope.today = {};
    $rootScope.today.week = dateService.getWeek(new Date());
    $rootScope.today.month = new Date().getMonth() + 1;
    $rootScope.today.year = new Date().getFullYear();

    // UI default controls
    $rootScope.ui = {};
    $rootScope.ui.navBar = false;
    $rootScope.ui.header = true;

    // variable that holds information about current user sessions (also stored in session storage)
    $rootScope.session = {};

    // variable that holds user information
    $rootScope.user = {};

    // display on top off the page
    $rootScope.message = '';
    $rootScope.error = '';

// Check if user can access particular page
// while application is not ready it shows loading page
    $scope.canAccess = function (route) {
        return RouteFilter.canAccess(route);
    };
    if ($location.path() === '/loading')
        return;
    if (!Application.isReady())
    {
        $location.path('/loading');
    }

    // Checks who can access the pages (if user not logged in only login page)
    RouteFilter.run($location.path());
    // Login to facebook and make app valid
    // FACEBOOK INIT ACTIVATE FOR PROD...
    console.log("1. Initializing Facebook...");
    $rootScope.message = "FB INIT";
    $rootScope.loadingstage = "Connecting to Facebook...";
    FBService.init()
            .then(function () {
                if (sessionService.getSession()) {
    $rootScope.message = "SESSION";
                    // If session exists, we should be able to query facebook without problem.
                    // Making appliaction ready, however other user data are still loaging
                    console.log("Continue Session", sessionService.getSession());
                    var session = sessionService.getSession();
                    $rootScope.user.id = session.authResponse['userID'];
                    Application.makeReady();
                }
                console.log("2. Getting login status.");
    $rootScope.message = "GETTING STATUS";
                $rootScope.loadingstage = "Waiting for response...";
                FBService.getStatus().then(function (response) {
                    if (response.status === 'connected') {
                        console.log("2.1 Connected");
    $rootScope.message = "GETTING STATUS1";
                        $rootScope.session = response;
                        sessionService.saveSession($rootScope.session);
                        $rootScope.message = "You're logged in to Facebook";
                        $rootScope.error = '';
                        if ($cookieStore.get('current_user')) {
                            $rootScope.user = $cookieStore.get('current_user');
    $rootScope.message = "GETTING STATUS cookie";
                            console.log("2.1.2 User from cookie");
                            Application.makeReady();
                        } else {
                            FBService.getMe().then(function (response) {
                                console.log("2.1.3 user from facebook");
                                    $rootScope.message = "GETTING STATUS from FB";

                                $rootScope.user = response;
                                $cookieStore.put('current_user', response);
                                Application.makeReady();
                            });
                        }
                        ;
                        console.log("3 Get other user information from Database");
                            $rootScope.message = "QUERY DB";

                        var id = response.authResponse.userID;
                        userService.getUser(id)
                                .success(function (user) {
                                    console.log("3.1 Information received");
                                    $rootScope.user.score = user.score;
                                    $rootScope.user.role = user.role;
                                    $cookieStore.put('current_user', $rootScope.user);
                                })
                                .error(function (error) {
                                    console.log("3.1 Could not get the user", error);
                                    if (error.message === 'Document not found') {
                                        $rootScope.user._id = $rootScope.user.id
                                        $rootScope.user.score = 1001;
                                        $rootScope.user.role = 'user';
                                        console.log($rootScope.user);
                                        userService.create($rootScope.user);
                                        $location.path("/tc");
                                    } else {
                                        console.log("3.2 Error accessing database", error)

                                    }
                                });
                        // get application data from the server
                        console.log("4. Get application data from the server")
                        dataService.getScores();
                        dataService.getNews();
                        dataService.getSuggestions();
                        dataService.getActivities();
                    } else {
                        console.log("2.2 not connected");
                        $rootScope.message = "Please login to Facebook";
                        console.log("2.2.1 Go to login page");
                        $location.path('/login');
                    }
                });
            });
    $rootScope.$on('$locationChangeStart', function (scope, next, current) {
    });
});
// Listen online offline
app.run(function ($window, $rootScope) {
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
        $rootScope.$apply(function () {
            $rootScope.online = false;
        });
    }, false);
    $window.addEventListener("online", function () {
        $rootScope.$apply(function () {
            $rootScope.online = true;
        });
    }, false);
});

app.run(function (RouteFilter, userService) {

    // Pages Available for unauthoried user
    RouteFilter.register('guest', ['/login'], function () {
        return userService.exists();
    }, '/');
    RouteFilter.register('user', ['/home'], function () {
        return userService.exists();
    }, '/');
    RouteFilter.register('user', ['/goals'], function () {
        return userService.exists();
    }, '/');
    RouteFilter.register('admin', ['/habits'], function () {
        return userService.isAdmin();
    }, '/');
    RouteFilter.register('profile/user', ['/profile'], function () {
        return userService.exists();
    }, '/');
    RouteFilter.register('feedback/user', ['/feedback'], function () {
        return userService.exists();
    }, '/');
    RouteFilter.register('tc/user', ['/tc'], function () {
        return userService.exists();
    }, '/');
    RouteFilter.register('profile/user', ['/login'], function () {
        return !userService.exists();
    }, '/');
});
