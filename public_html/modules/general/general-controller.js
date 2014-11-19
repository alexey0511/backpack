var generalModule = angular.module('general-module', [
//    'ngResource',
    'ngRoute',
    'ngAnimate',
    'directives'
]);

generalModule.directive('facebookComments', function () {
    function createHTML(href, numposts, colorscheme) {
        return '<div class="fb-comments" ' +
                       'data-href="' + href + '" ' +
                       'data-numposts="' + numposts + '" ' +
                       'data-colorsheme="' + colorscheme + '">' +
               '</div>';
    }

    return {
        restrict: 'A',
        scope: {},
        link: function postLink(scope, elem, attrs) {
            attrs.$observe('pageHref', function (newValue) {
                var href        = newValue;
                var numposts    = attrs.numposts    || 5;
                var colorscheme = attrs.colorscheme || 'light';

                elem.html(createHTML(href, numposts, colorscheme));
                FB.XFBML.parse(elem[0]);
            });
        }
    };
}),
generalModule.directive('facebookLike', ['$timeout', function ($timeout) {
    return {
        template:
            '<div class="fb-like" ' +
                'data-href="" ' +
                'data-send="false" ' +
                'data-layout="button_count" ' +
                'data-width="450" ' +
                'data-show-faces="false"></div>',
        link: function (scope, element, attributes) {
            $timeout(function () {
                return typeof FB !== "undefined" && FB !== null
                    ? FB.XFBML.parse(element.parent()[0])
                    : void 0; });
            }
    };
 }]),

// LOGIN PAGE CONTROLLER
 generalModule.controller("tcCtrl", function ($scope, $location)
 {
     $scope.confirm = function() {
         $location.path("/goals");
     }
     
     
 });
generalModule.controller('loginController', function ($scope, $cookieStore, $rootScope, AUTH_EVENTS, LoginService, Session, $location, userService) {

    $rootScope.getAuthentication = function () {
        if (Session.userId !== '') {
            $rootScope.user.userId = Session.userId;
            $rootScope.isAuthenticated = LoginService.isAuthenticated(Session);
        }
        return $rootScope.isAuthenticated;
    };
    $rootScope.signOut = function () {
        Session.destroy();
        $rootScope.getAuthentication();
    };

    $rootScope.setCurrentUser = function (user) {
        alert(user.username);
    };

    // Log User IN  Application is calling login service
}); // end of login controller

///

// Profile PAGE CONTROLLER
generalModule.controller('profileController', function ($scope, Session, LoginService) {

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
    console.log('sendChallenge',response);        });
    };
    
    
    $scope.userId = 'empty username';
    $scope.getUserId = function () {
        $scope.userId = Session.userId;
        $scope.user.username = $scope.userId;
        $scope.user = {};
        return $scope.userId;
    };


    $scope.getUser = function () {
        if (typeof ($scope.getUserId) === "undefined") {
            return;
        } else {
            LoginService.login($scope.user).then(function (responseUser) {
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
generalModule.controller('homeController', function ($scope) {
//generalModule.controller('homeController', function($scope, ngProgress) {
//    console.log(appConfig.appId);


//    ngProgress.start();
//// checking loading bar... delete after the test
//    setTimeout(go, 1000);
//    function go() {
//        $(document).ready(function () {
//            ngProgress.complete();
//        });
//    }

}); // end of home page controller
// LOADING PAGE CONTROLLER
generalModule.controller('loadingController', function ($scope, $location, Application) {
    Application.registerListener(function () {
        $location.path("/home");
//                     $location.path('/goals');
   });
//generalModule.controller('loadingController', function ($scope, $location, ngProgress) {
//// checking loading bar... delete after the test
//    setTimeout(go, 1000);
//    function go() {
//        $(document).ready(function () {
//            ngProgress.complete();
//            $location.path("/login");
//        });
//    }
}); // end of loading page controller


