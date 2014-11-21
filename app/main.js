
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
    'ui.slider',
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
    $routeProvider.when('/habits', {
        templateUrl: 'modules/habits/habits.html',
        controller: 'habitsController'
    });
    $routeProvider.when('/habits/:id/', {
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
app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});
app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
});
// CONTROLLERS

app.controller('navigationController', function ($scope, $location)
{
//    console.log("navigationController");
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});
app.controller('mainController', function (appConfig, lsService, $scope, $rootScope,
        RouteFilter, dateService, FBService, $q, $location, Application, $cookieStore, userService, goalsService)
{


    // MainController has actions only for initializing facebook
//    console.log(">mainController");
    // Read that value back

    goalsService.getScores().success(function (data) {
        console.log("SCORES: ", data);
        $scope.scores = data;
    })
            .error(function () {
                $rootScope.message = "Can't display user scores";
                console.log("can't display user scores");
            })
    goalsService.getNews().success(function (data) {
        console.log("News: ", data);
        $scope.news = data;
    })
            .error(function () {
                $rootScope.message = "Can't display news";
                console.log("can't display user news");

            });
    goalsService.getSuggestions().success(function (suggestions) {
        console.log("Suggestions: ", suggestions);
        $rootScope.suggestions = suggestions;
    })
            .error(function () {
                $rootScope.message = "Can't display news";
                console.log("can't display user news");

            });
    goalsService.getActivities().success(function (data) {
        console.log("Activities: ", data);
        $rootScope.activities = data;
    })
            .error(function () {
                $rootScope.message = "Can't display news";
                console.log("can't display user news");

            });

    $rootScope.today = {};
    $rootScope.today.week = dateService.getWeek(new Date());
    $rootScope.today.month = new Date().getMonth();
    $rootScope.today.year = new Date().getFullYear();
    $rootScope.ui = {};
    $rootScope.ui.navBar = false;
    $scope.navHideShow = function () {
        $rootScope.ui.navBar = !$rootScope.ui.navBar;
    }
    $scope.goGoals = function () {
        $location.path('/goals');
    }
    $scope.goHome = function () {
        $location.path('/home');
    }
    $scope.goProfile = function () {
        $location.path('/profile');
    }
    $scope.goFeedback = function () {
        $location.path('/feedback');
    }
    $scope.goOath = function () {
        $location.path('/tc');
    }
    console.log("0. Start Application");
    $rootScope.user = {};
    $rootScope.message = '';
    $rootScope.error = null;
    $scope.canAccess = function (route) {
        return RouteFilter.canAccess(route);
    };
    if ($location.path() === '/loading')
        return;
    if (!Application.isReady())
    {
        $location.path('/loading');
    }

    $scope.fblogin = function () {
        FBService.login(function (response) {
//            $location.path('/home');
            $location.path('/goals');
        });
        console.log("login (inside controller)");
    }

    RouteFilter.run($location.path());
    // FACEBOOK INIT ACTIVATE FOR PROD...
    console.log("1. Initializing Facebook...");
    $rootScope.loadingstage = "Connecting to Facebook...";
    FBService.init()
            .then(function () {
                console.log("2. Getting login status.");
                $rootScope.loadingstage = "Getting Status...";
                FBService.getStatus().then(function (response) {
                    if (response.status === 'connected') {
                        console.log("2.1 Connected");
                        $rootScope.message = "You're logged in to Facebook";
                        $rootScope.error = '';
                        if ($rootScope.user != null && $rootScope.user._id != null) {
                            console.log("2.1.1 User from rootScope");
                            Application.makeReady();
                        } else if ($cookieStore.get('current_user')) {
                            $rootScope.user = $cookieStore.get('current_user');
                            console.log("2.1.2 User from cookie");
                            Application.makeReady();
                        } else {
                            FBService.getMe().then(function (response) {
                                console.log("2.1.3 user from facebook");
                                $rootScope.user = response;
                                $cookieStore.put('current_user', response);
                                Application.makeReady();
                            });
                        }
                        ;

                        console.log("3 Get other user information from Database");
                        var id = response.authResponse.userID;
                        userService.getUser(id)
                                .success(function (user) {
                                    console.log("3.1 Information received");
                                    $rootScope.user.score = user.score;
                                    $rootScope.user.role = user.role;
                                    $cookieStore.put('current_user', $rootScope.user);
                                })
                                .error(function (error) {
                                    console.log("3.1 Could not get the user", error)
                                });
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
app.controller('myController', function ($scope, userRepository, ygRepository) {
    console.log("myController");
    userRepository.getAllUsers().success(function (users) {
        $scope.users = users;
    });
    ygRepository.getAllyg().success(function (yg) {
        $scope.yg = yg;
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
