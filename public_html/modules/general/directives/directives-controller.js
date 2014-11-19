var app = angular.module('directives', []);

// FACEBOOK LOGIN
app.directive('myFacebook', [
    function () {
        return {
            link: function (scope, element, attrs) {
// Load the SDK asynchronously
                (function (d) {
                    var js, id = 'facebook-jssdk',
                            ref = d.getElementsByTagName('script')[0];
                    if (d.getElementById(id)) {
                        return;
                    }
                    js = d.createElement('script');
                    js.id = id;
                    js.async = true;
                    js.src = "//connect.facebook.net/en_US/all.js";
                    ref.parentNode.insertBefore(js, ref);
                }(document));
// Initialize FB
                window.fbAsyncInit = function () {
                    FB.init({
                        appId: '1526114560951318',
                        status: true, // check login status
                        cookie: true, // enable cookies to access the session
                        xfbml: false // parse XFBML
                    });
//Check FB Status
                    FB.getLoginStatus(function (response) {
                        if (response.status == 'connected') {
                            FB.api('/me', function (response) {
                                scope.$apply(function () {
                                    scope.user = response;
                                });
                            });
                        } else {
                            FB.login();
                        }
                    });
                };
                scope.user.first_name = " ";
                scope.user.last_name = " ";
            },
            template: "Welcome {{user.first_name}} {{user.last_name}}"
        };
    }
]);

//
// LOGIN
app.directive('customLogin1', function ($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/general/directives/login_new.html', 
    };
});
// LOGIN
app.directive('customLogin', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/general/directives/login.html'
    };
});
// FOOTER
app.directive('customFooter', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/general/directives/footer.html'
    };
});
// NAVIGATION
app.directive('customNavigation', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/general/directives/navigation.html'
    };
});
// Advertising
app.directive('customAd', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/general/directives/zad.html'
    };
});
// HEADER
app.directive('customHeader', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/general/directives/header.html'
    };
});

