app.controller('loginController', function($scope, $rootScope, AUTH_EVENTS, LoginService, Session, $location) {
$scope.credentials = {
        username: '',
        password: ''
    };
    $rootScope.user = {
        username: '',
        password: '',
        role:''
    };
$scope.facebookLogin = function()
{
alert("Login with facebook");    
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
    $scope.login = function(credentials) {
        // application calling login service
        LoginService.login(credentials, $location).then(function(user) {
//            console.log(user);

            if (user.data.length === 1) {
                // success - create session and redirect
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                console.log(AUTH_EVENTS.loginSuccess);
                $scope.user.username = user.data[0].username;
                $scope.user.role = user.data[0].role;
                $scope.user.score = user.data[0].score;
                Session.create("1", $scope.user.username, $scope.user.role, $scope.user.score);
                $scope.getAuthentication();
          //      $location.path("/home");
            } else {
                // user not allowed to login
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                console.log(AUTH_EVENTS.loginFailed);
                return;
            }
        });  // end of call to login service
    }; // end of login function on login page
}); // end of login controller

///

