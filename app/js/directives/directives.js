angular.module('components', [])
        .directive('dateBox', function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    name: '='
                },
                templateUrl: 'pages/partials/date-box.html'
            };
        })
        .directive('habitDay', function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    day: '='
                },
                templateUrl: 'templates/directives/habit-day.html'
            };
        })
        // login
        .directive('login', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/directives/login.html'
//                template: "<div>LOGIIIIIIIIIIN</div>"
            };
        });
        app.directive('customFooter', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/directives/footer.html'
           //     template: "<div>LOGIIIIIIIIIIN</div>"
            };
        });

        app.directive('customNavigation', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/directives/navigation.html'
           //     template: "<div>LOGIIIIIIIIIIN</div>"
            };
        });
