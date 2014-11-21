var generalModule = angular.module('general-module', [
//    'ngResource',
    'ngRoute',
    'ngAnimate',
    'directives'
]);
app.controller('navigationController', function ($scope, $location)
{
//    console.log("navigationController");
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});

app.controller('headerController', function ($scope, $location, $rootScope)
{
    $scope.navHideShow = function () {
        $rootScope.ui.navBar = !$rootScope.ui.navBar;
    };
    $scope.headerHideShow = function () {
        $rootScope.ui.header = !$rootScope.ui.header;
    };
    $scope.goGoals = function () {
        $location.path('/goals');
    };

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
});


generalModule.controller("tcCtrl", function ($scope, $location)
{
    $scope.confirm = function () {
        $location.path("/goals");
    };
});
generalModule.controller('loginController', function () {
}); // end of login controller

///

// Profile PAGE CONTROLLER
generalModule.controller('profileController', function ($scope, sessionService, userService, $cookieStore, lsService, goalsService, $rootScope, $location) {
    $scope.logout = function () {
        var response = confirm("Are you sure?");
        if (response === true) {
            console.log("... login out from the system");
            sessionService.deleteSession();
            $cookieStore.remove('current_user');
            $rootScope.user = '';
            $location.path('/logout');
        }
    };
    $scope.delete_account = function () {
        var response = confirm("Are you sure?");

        if (response === true) {
            console.log("deleting user");

            userService.delete($rootScope.user.id);
            lsService.deleteGoals();
            goalsService.deleteGoals()
                    .success(function (data) {
                        console.log("successfuly deleted");
                    })
                    .error(function (data) {
                        console.og("error while deleting");
                    });
            $cookieStore.remove('current_user');
            $rootScope.user = '';
            $location.path('/logout');
        }
        ;
    };
    $scope.sendChallenge = function (to, message) {
        //FB.login(callback, {scope: 'user_friends'});
        var options = {
            method: 'apprequests'
        };
        if (to)
            options.to = to;
        if (message)
            options.message = message;
        FB.ui(options, function (response) {
            console.log('sendChallenge', response);
        });
    };
}); // end of controller

// HOME PAGE CONTROLLER
generalModule.controller('homeController', function () {

}); // end of home page controller
// LOADING PAGE CONTROLLER
generalModule.controller('loadingController', function ($scope, $location, Application) {
    Application.registerListener(function () {
        $location.path("/home");
//                     $location.path('/goals');
    });
}); // end of loading page controller


generalModule.controller('generalController', function ($scope) {
});
    