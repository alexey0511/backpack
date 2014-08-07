
var goalsModule = angular.module('goals-module', [
]);



goalsModule.controller('goalsController', function($scope, $cookieStore, ngDialog, DbActionsService, ygRepository, mgRepository, wgRepository, YearGoalC, MonthGoalC, WeekGoalC, LoginService, $location, $rootScope, Session) {
$('#sandbox-container div').datepicker({
    startView: 1,
    minViewMode: 1,
    todayBtn: true
});
    // GOAL CRUD 
    $scope.addWeekGoal1 = function() {
//        console.log($scope.weekGoal);
        $scope.value = true;
        if (typeof ($scope.weekGoal.name) === 'undefined') {
            alert(' please enter name first');
            return;
        }
        $scope.weekGoal.year = new Date().getFullYear();
        $scope.weekGoal.month = new Date().getMonth() + 1;
        $scope.weekGoal.week = '01';
        $scope.weekGoal.userId = $cookieStore.get('current_user').id;
        $scope.weekGoal.done = false;

        DbActionsService.create('weekGoals', $scope.weekGoal).success(function(result) {
            console.log("+++++++");
            console.log(result);
        $scope.weekGoal = result;
                console.log($scope.weekGoal);
            $scope.weekGoals1.push($scope.weekGoal);
            ngDialog.close();
        });

    }; // end add week goal 

    $scope.updateWeekGoal = function(id) {
        delete $scope.weekGoal._id;
        DbActionsService.update('weekGoals', id, $scope.weekGoal).success
                (function() {
                    $scope.weekGoals1 = {};
                    DbActionsService.getAll('weekGoals').success(function(records) {
                        console.log("update");
                        $scope.weekGoals1 = records;
                    });
                });
        ngDialog.close();

    };
    $scope.deleteWeekGoal = function(id) {
        DbActionsService.delete('weekGoals', id).success
                (function() {
                    $scope.weekGoals1 = {};
                    DbActionsService.getAll('weekGoals').success(function(records) {
                        console.log("deleted");
                        $scope.weekGoals1 = records;
                    });
                });
        ngDialog.close();
    };

    /// END OF GOAL CRUD   


    // OTHER EVENTS  
    $scope.click = function(id) {
        DbActionsService.getRecord1('weekGoals', id).success(function(records) {
            $scope.weekGoal = records;
            console.log("......");
            console.log($scope.weekGoal);
            ngDialog.open({
                template: 'templates/directives/weekGoal.html',
                scope: $scope
            });
        });

    };
//    console.log("scope");
    //  console.log($scope.weekGoal);

    // LOAD existing tasks
    if ($cookieStore.get('current_user')) {
        console.log($cookieStore.get('current_user').id);
        var query = '{"userId": "' + $cookieStore.get('current_user').id + '"}';
        DbActionsService.getRecord('weekGoals', query).success(function(records) {
            $scope.weekGoals1 = records;
        });
    }
    ;

    $scope.openAddWeekDialog = function() {
        $scope.weekGoal = {};
        ngDialog.open({
            template: 'templates/directives/weekGoal.html',
            scope: $scope
        });
    };


    // old code
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
            if (typeof ($scope.user.userId) !== "undefined" && $scope.user.userId !== '') {
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


