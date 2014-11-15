// Profile PAGE CONTROLLER
app.controller('profileController', function($scope, Session, LoginService) {
    
$scope.userId = 'empty username';
$scope.getUserId = function() {
$scope.userId = Session.userId;
$scope.credentials.username = $scope.userId;
$scope.user = {};
return $scope.userId;
};

$scope.getUser = function() {
    if (typeof($scope.getUserId) === "undefined"){
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