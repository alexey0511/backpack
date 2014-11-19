// TASKS PAGE CONTROLLER
app.controller('TasksController', function($scope, ygRepository, mgRepository, wgRepository, YearGoalC, MonthGoalC, WeekGoalC, LoginService, $location, $rootScope, Session) {
    ygRepository.getAllyg().success(function(yg) {
        $scope.yearGoals = yg;
    });
    mgRepository.getAllmg().success(function(mg) {
        $scope.monthGoals = mg;
    });
    wgRepository.getAllwg().success(function(wg) {
        $scope.weekGoals = wg;
    });
    // check if user is Authenticated
    if (LoginService.isAuthenticated() || !LoginService.isAuthenticated()) {
        // get user details from session
        $scope.user = {
            userId: 'test',
            role: '',
            authenticated: false
        };

        // called 9 times, find out why.......
        $scope.checkAccess = function() {
            if (typeof($scope.user.userId) !== "undefined" && $scope.user.userId !== '') {
                console.log($scope.user.userId);
                 return true;
            } else {
                console.log($scope.user.userId);
                return false;
            }
        };


//console.log("userId: "+ $scope.user.userId);

        // YES - Do the logic
//$scope.yearGoals = [
//    {
//        id: 2014,
//        name: "Earn $1 000 000",
//        year: '2014', 
//        award: "new house",
//        penalty: "1000 laps in a swimming pool"
//        
//    },
//    {
//        id: 2015,
//        name: "Buy Lamborgini",
//        year: '2015'
//    }
//];
//$scope.monthGoals = [
//    {
//        id: 07,
//        name: "Finish the book",
//        year: '2014',
//        month: '07'
//    },
//    {
//        id: 02,
//        name: "Save $10 000",
//        year: '2015',
//        month: '01'
//    }
//];
//$scope.weekGoals = [
//    {
//        id: 111,
//        name: "Go to training",
//        year: '2014',
//        month: '07',
//        week: '0'
//    },
//    {
//        id: 2222,
//        name: "Finish Programm",
//        year: '2014',
//        month: '01',
//        week: '01'
//    }
//];

        $scope.todos = [
            {text: 'Learn AngularJS', done: false},
            {text: 'Build an App', done: false}
        ];
        $scope.disableLists = function() {
            if (typeof ($scope.monthGoal) === "undefined") {
                // disable weeks list
            }
            if (typeof ($scope.yearGoal) === "undefined") {
            }
        };
        $scope.disableLists();

        $scope.getToDoTotals = function() {
            return $scope.todos.length;
        };

        $scope.ClearCompleted = function() {
            $scope.todos = _.filter($scope.todos, function(todo) {
                return !todo.done;
            });
        };
        $scope.addTodo = function() {
            $scope.todos.push({text: $scope.formTodoText, done: false});
            $scope.weekGoals.push({
                name: $scope.formTodoText,
                year: new Date().getFullYear(),
                month: new Date().getMonth(),
                week: '01',
                done: false});
            $scope.formTodoText = '';
        };
        $scope.addYearGoal = function() {
            if (typeof ($scope.yearGoal) === 'undefined') {
                alert(' please enter something first');
                return;
            }
            if ($scope.yearGoals.length >= 3) {
                alert("Too many goals for the year. slow down");
                return;
            }

//        $scope.yearGoals.push({
//            name: $scope.yearGoal.name,
//            year: new Date().getFullYear(),
//            award: $scope.yearGoal.award,
//            penalty: $scope.yearGoal.penalty,
//            done: false
//        });
            YearGoalC.save(
                    {
                        name: $scope.yearGoal.name,
                        year: new Date().getFullYear(),
                        award: $scope.yearGoal.award,
                        penalty: $scope.yearGoal.penalty,
                        done: false

                    });

        };
        $scope.addMonthGoal = function() {
            if (typeof ($scope.monthGoal) === 'undefined') {
                alert(' please enter something first');
                return;
            }
            if ($scope.monthGoals.length >= 7) {
                alert("Too many goals for the month. slow down");
                return;
            }

//        $scope.monthGoals.push({
//            name: $scope.monthGoal.name,
//            year: new Date().getFullYear(),
//            month: new Date().getMonth()+1,
//            award: $scope.monthGoal.award,
//            penalty: $scope.monthGoal.penalty,
//            done: false
//            });
            MonthGoalC.save({
                name: $scope.monthGoal.name,
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                award: $scope.monthGoal.award,
                penalty: $scope.monthGoal.penalty,
                done: false

            });
            console.log($scope.monthGoals);
            $scope.formMonthGoalText = '';
        };
        $scope.addWeekGoal = function() {
            if (typeof ($scope.weekGoal) === 'undefined') {
                alert(' please enter something first');
                return;
            }


            $scope.weekGoals.push({
                name: $scope.weekGoal.name,
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                week: '01',
                done: false});

            WeekGoalC.save({
                name: $scope.weekGoal.name,
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                week: '01',
                done: false
            });

            console.log($scope.weekGoals);

            $scope.formWeekGoalText = '';
        };

    } else {
        $location.path('/login');
    }



$scope.yearGoalCompleted = function(id) {
    $scope.getObjectById(id);
//    console.log($scope.getObjectById(id));
};

}); // end of controller


