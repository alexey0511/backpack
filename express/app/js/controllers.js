app.controller('NavigationController', function($scope, $location)
{
    $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };
});


// HOME PAGE CONTROLLER
app.controller('HomeController', function() {

});


app.controller('myController', function($scope, userRepository, ygRepository) {
    userRepository.getAllUsers().success(function(users) {
        $scope.users = users;
    });
    ygRepository.getAllyg().success(function(yg) {
        $scope.yg = yg;
    });
});
app.controller('getHabitsCTRL', function($scope, habitRepository) {
    habitRepository.getAllHabits().success(function(habits) {
        $scope.habits = habits;
    });
});