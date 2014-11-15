angular.module('components', [])
        // LOGIN
        .directive('login', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/directives/login.html'
            };
        });
        // FOOTER
        app.directive('customFooter', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/directives/footer.html'
            };
        });
// NAVIGATION
        app.directive('customNavigation', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/directives/navigation.html'
           //     template: "<div>LOGIIIIIIIIIIN</div>"
            };
        });
// HEADER
        app.directive('customHeader', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/directives/header.html'
           //     template: "<div>LOGIIIIIIIIIIN</div>"
            };
            
        });
