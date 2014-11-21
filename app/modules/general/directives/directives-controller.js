var app = angular.module('directives', []);

// FACEBOOK DIRECTIVES
app.directive('facebookLike', function () {
    function createHTML(href) {
        return '<div class="fb-like" ' +
                'data-href="' + href + '" ' +
                'data-send="false" ' +
                'data-layout="standard" ' +
                'data-action="like" ' +
                'data-width="450" ' +
                'data-show-faces="false">' +
                '</div>';
    }
    return {
        restrict: 'A',
        scope: {},
        link: function postLink(scope, elem, attrs) {
            attrs.$observe('pageHref', function (newValue) {
                var href = newValue;
                elem.html(createHTML(href));
                FB.XFBML.parse(elem[0]);
            });
        }
    };
});
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
                var href = newValue;
                var numposts = attrs.numposts || 5;
                var colorscheme = attrs.colorscheme || 'light';
                elem.html(createHTML(href, numposts, colorscheme));
                FB.XFBML.parse(elem[0]);
            });
        }
    };
});


// HEADER
app.directive('customHeader', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/general/directives/header.html',
        controller: 'headerController'
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
// Advertise
app.directive('customAd', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/general/directives/zad.html'
    };
});
// LOGIN
app.directive('aoLogin', function (FBService, $location, $rootScope, $cookieStore, sessionService) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/general/directives/login.html',
        link: function (scope, element, attrs) {
            scope.fblogin = function () {
                FBService.login(function (response) {
                    console.log(response);
                    $rootScope.session = response;
                    if (response.status === 'connected') {
                        sessionService.saveSession();
                        FBService.getMe().then(function (data) {
                            if (data.name) {
                                $rootScope.user = data;
                                $cookieStore.put('current_user', $rootScope.user);
                                console.log("successful login");
                            }
                            ;
                        });
                        $location.path('/home');

                    }
                });
            }
            ;
        }
    };
});
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
