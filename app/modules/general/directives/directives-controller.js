var app = angular.module('directives', []);
// FACEBOOK LOGIN

app.directive('cBar', function ($rootScope) {
    return {
        restrict: "E",
        replace: true,
        template: function () {
            var output = '<table class="table">';
            output += "<tr>";
            for (var i = 1; i <= 52; i++) {
                if (i === 14 || i === 27 || i === 40) {
                    output += '</tr>';
                    output += '<tr>';
                }
                if (i < $rootScope.today.week) {
                    output += '<td style="background: green; border: 1px black solid">' + i + '</td>';
                } else {
                    output += '<td style="border: 1px black solid">' + i + '</td>';
                }
            }
            output += '</tr></table>';
            return output;
        }
    };
});
app.directive('facebookLike', ['$timeout', function () {
        return {
            restrict: "EA",
            replace: true,
            scope: "=data-href",
            template:
                    '<div class="fb-like" ' +
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

