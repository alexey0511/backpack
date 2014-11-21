var app = angular.module('directives', []);

// FACEBOOK LOGIN
app.directive('facebookLike', ['$timeout', function () {
    return {
        restrict: "E",
        replace: true,
        scope: "=data",
        template:
            '<div class="fb-like" ' +
                'data-href="data" ' +
                'data-send="false" ' +
                'data-layout="standard" ' +
                'data-action="like" ' +
                'data-width="450" ' +
                'data-show-faces="false"></div>'
    };
 }]);

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

