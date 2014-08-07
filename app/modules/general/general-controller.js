var generalModule = angular.module('general-module', [
    'ngResource',
    'ngRoute'
]);



// LOGIN PAGE CONTROLLER
generalModule.controller('loginController', function($scope, $cookieStore, $rootScope, AUTH_EVENTS, LoginService, Session, $location, userService, $facebook) {
   $scope.user = {};
     $scope.user.first_name = "stranger";
    $facebook.getLoginStatus().then(
            function(response) {
                console.log(response);
            });
    $facebook.api("/me").then(
            function(response) {
                console.log(response);
                document.getElementById('status').className = "alert alert-success";
                $scope.user.first_name = response.first_name;
            });
            

    $scope.credentials = {
        username: '',
        password: ''
    };
    $rootScope.user = {
        username: '',
        password: '',
        role: ''
    };

    $scope.facebookLogin = function()
    {
        FB.login(function(response) {
            if (response.status === 'connected') {
                FB.api('/me', function(response) {
                    $scope.credentials = response;
                    console.log("User", $scope.credentials);
                    $scope.credentials.username = $scope.credentials.id;
                    console.log("USERNAME", $scope.credentials.username);
                    userService.getUser($scope.credentials).then(function(user) {
                        if (user.data.length === 1) {
                            console.log(".......1 user found.....");
                            // success - create session and redirect
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                            console.log(AUTH_EVENTS.loginSuccess);
                            $scope.user = user.data[0];
                            Session.create("1", $scope.user.username, $scope.user.role, $scope.user.score);
                            $scope.getAuthentication();
                            $cookieStore.put('current_user', $scope.user);
                            
                            console.log("user cook:", $cookieStore.get('current_user'));
                            document.getElementById('status').className = "alert alert-success";
                        } else if (user.data.length === 0) {
                            $scope.credentials.role = "user";
                            $scope.credentials.score = "1001";
                            console.log(".......no users found.....");
                            userService.create($scope.credentials);
                            document.getElementById('status').className = "alert alert-success";
                        } else {
                            // too many users return 
                            Session.destroy();
                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                            console.log(AUTH_EVENTS.loginFailed);
                            return;
                        }
                    });  // end of call to login service

                });
            } else if (response.status === 'not_authorized') {
                // The person is logged into Facebook, but not your app.
                document.getElementById('status').innerHTML = 'Please log ' +
                        'into this app.';
                document.getElementById('status').className = "alert alert-warning";
            } else {
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
                document.getElementById('status').innerHTML = 'Please log ' +
                        'into Facebook.';
                document.getElementById('status').className = "alert alert-danger";
            }
        }, {scope: 'public_profile,email'});
    };

    $scope.getAuthentication = function() {
        if (Session.userId !== '') {
            $scope.user.userId = Session.userId;
            $scope.isAuthenticated = LoginService.isAuthenticated(Session);
        }
        return $scope.isAuthenticated;
    };
    $scope.signOut = function() {
        Session.destroy();
        $scope.getAuthentication();
    };

    $scope.setCurrentUser = function(user) {
        alert(user.username);
    };

    // Log User IN  Application is calling login service
}); // end of login controller

///

// Profile PAGE CONTROLLER
generalModule.controller('profileController', function($scope, Session, LoginService) {

    $scope.userId = 'empty username';
    $scope.getUserId = function() {
        $scope.userId = Session.userId;
        $scope.credentials.username = $scope.userId;
        $scope.user = {};
        return $scope.userId;
    };


    $scope.getUser = function() {
        if (typeof ($scope.getUserId) === "undefined") {
            return;
        } else {
            LoginService.login($scope.credentials).then(function(responseUser) {
//            console.log(user);
                if (responseUser.data.length === 1) {

                    // success - create session and redirect
                    $scope.user = responseUser.data[0];
                    console.log($scope.user);
                    return $scope.user;

                }
            });  // end of call to login service

        }
    };




}); // end of controller


// HOME PAGE CONTROLLER
generalModule.controller('homeController', function($scope, ngProgress, $facebook) {
//generalModule.controller('homeController', function($scope, ngProgress) {
    console.log("...debug....");
//    console.log(appConfig.appId);

//    $facebookProvider.setAppId("appConfig.appId");

    ngProgress.start();
// checking loading bar... delete after the test
    setTimeout(go, 1000);
    function go() {
        $(document).ready(function() {
            ngProgress.complete();
        });
    }

}); // end of home page controller
// LOADING PAGE CONTROLLER
generalModule.controller('loadingController', function($scope, $location, ngProgress) {
    ngProgress.start();
// checking loading bar... delete after the test
    setTimeout(go, 1000);
    function go() {
        $(document).ready(function() {
            ngProgress.complete();
            $location.path("/login");
        });
    }
}); // end of loading page controller


