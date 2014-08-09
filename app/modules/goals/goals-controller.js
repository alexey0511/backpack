
var goalsModule = angular.module('goals-module', [
]);



goalsModule.controller('goalsController', function($scope, $cookieStore, ngDialog, DbActionsService, ygRepository, mgRepository, wgRepository, YearGoalC, MonthGoalC, WeekGoalC, LoginService, $location, $rootScope, Session) {
    // create userData Object
    $scope.userData = {};
    $scope.userData.goals = {};
    $scope.userData.goals.weekGoals = {};
//    $scope.userData.goals.weekGoals._id = {};
    $scope.currentWeek = "32";
    $scope.userData.goals.weekGoals[$scope.currentWeek] = $scope.currentWeek;

//    $scope.userData.goals.weekGoals = {"one":  {"2":"3"}};
    console.log($scope.userData.goals);
    // end U
    // LOAD existing tasks
    if ($cookieStore.get('current_user')) {
        // TRY TO GET DATA FROM COOKIES
        if ($cookieStore.get('user_data')) {
            $scope.weekGoals1 = $cookieStore.get('user_data').weekGoals[$scope.currentWeek];
            console.log($cookieStore.get('user_data'));
            console.log($scope.weekGoals1);
        } else {
            console.log("no cookie");
            // IF NOT - CALL DATABASE
            var query = '{"userId": "' + $cookieStore.get('current_user').id + '"}';
            DbActionsService.getRecord('weekGoals', query).success(function(records) {
                $scope.weekGoals1 = records;

                // PUT TO COOKIE
                $scope.goals = {};
                $scope.goals.weekGoals = {};
                $scope.goals.weekGoals[$scope.currentWeek] = [];
                for (i = 0; i < $scope.weekGoals1.length; i++) {
                    $scope.goals.weekGoals[$scope.currentWeek].push($scope.weekGoals1[i]);
                }
                $cookieStore.remove('user_data');
                $cookieStore.put("user_data", $scope.goals);
                console.log("cookload", $cookieStore.get("user_data"));
            });
        }

    }
    ;
// END LOAD TASKS
    $scope.userData = {};
    $scope.CurrentlyWorking = function() {
        $scope.userData.goals = ['weekGoals', 'monthGoals', 'weekGoals'];
        $scope.userData.goals = {"weekGoals": $scope.weekGoals1};
        console.log($scope.userData);
    };
    console.log($cookieStore.get('current_user'));
    $scope.totalCost = 0;
    $scope.actualCost = 0;
    $scope.calculateTotalCosts = function() {
        if ($scope.totalCostsChk == true) {
            for (var i in $scope.weekGoals1) {
                var weekGoal = $scope.weekGoals1[i];
                $scope.totalCost += weekGoal.cost;
            }
        } else {
            $scope.totalCost = 0;
        }
    };
    $scope.calculateTotalCostsActual = function() {
        if ($scope.actualCostsChk == true) {
            for (var i in $scope.weekGoals1) {
                var weekGoal = $scope.weekGoals1[i];
                var user = $cookieStore.get('current_user');
                if (weekGoal.done === true) {
                    $scope.actualCost += weekGoal.cost;
                    user.score = parseInt(user.score) + parseInt(weekGoal.cost);
                    $cookieStore.put('current_user', user);
                }
            }
        } else {
            $scope.actualCost = 0;
        }
    };


    $scope.weekGoal = {};
    $scope.years = [];
    for (i = 2014; i <= 2020; i++) {
        $scope.years.push(i);
    }
    // temprorary - change with actual;
    $scope.costs = [];
    for (i = 0; i <= 50; i++) {
        $scope.costs.push(i);
    }
    ;


    $scope.months = [];
    $scope.months = [
        {value: 'January',
            id: 1},
        {value: 'February',
            id: 2},
        {value: 'March',
            id: 3},
        {value: 'April',
            id: 4},
        {value: 'May',
            id: 5},
        {value: 'June',
            id: 6},
        {value: 'July',
            id: 7},
        {value: 'August',
            id: 8},
        {value: 'September',
            id: 9},
        {value: 'October',
            id: 10},
        {value: 'November',
            id: 11},
        {value: 'December',
            id: 12}];
//    console.log($scope.months);
    Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()) / 7);
    };
    $scope.weeks = [];
    for (i = 1; i <= 52; i++) {
        $scope.weeks.push(i);
    }
    var d = new Date();
    var week = d.getWeek();
    $scope.currentWeek = d.getWeek();

    //   console.log("Week: ", week);
    $scope.weekGoal.week = week;
    //  console.log($scope.weekGoal.week, "WEEKS");
// GOAL CRUD 
    $scope.addWeekGoal1 = function() {
        // CHECK IF NAME IS THERE
        $scope.value = true;
        if (typeof ($scope.weekGoal.name) === 'undefined') {
            alert(' please enter name first');
            return;
        }
        // ASSIGN LAST PROPERTIES
        $scope.weekGoal.userId = $cookieStore.get('current_user').id;
        $scope.weekGoal.done = false;
        DbActionsService.create('weekGoals', $scope.weekGoal).success(function(result) {
            //      console.log(result);
            $scope.weekGoal = result;
            //    console.log($scope.weekGoal);
            $scope.weekGoals1.push($scope.weekGoal);
// PUSH TO COOKIE
// FOR SOME REASON HAVE TO REINITIALISE
            $scope.goals = {};
            $scope.goals.weekGoals = {};
            $scope.goals.weekGoals[$scope.currentWeek] = [];
            for (i = 0; i < $scope.weekGoals1.length; i++) {
                $scope.goals.weekGoals[$scope.currentWeek].push($scope.weekGoals1[i]);
            }
            $scope.goals.weekGoals[$scope.currentWeek].push($scope.weekGoal);
            $cookieStore.remove('user_data');
            $cookieStore.put("user_data", $scope.goals);
            console.log($cookieStore.get("user_data"));
// PUSH TO COOKIE

            ngDialog.close();
        });

    }; // end add week goal 

    $scope.updateWeekGoal = function(id) {
        delete $scope.weekGoal._id;
        DbActionsService.update('weekGoals', id, $scope.weekGoal).success
                (function() {
                    $scope.weekGoals1 = {};
                    DbActionsService.getAll('weekGoals').success(function(records) {
                        $scope.weekGoals1 = records;

                        // UPDATE COOKIE
                        $cookieStore.remove('user_data');
                        console.log("....data removed....");
                        console.log($cookieStore.get("user_data"));
                        for (i = 0; i < $scope.weekGoals1.length; i++) {
                            $scope.goals.weekGoals[$scope.currentWeek].push($scope.weekGoals1[i]);
                        }
                        $cookieStore.put("user_data", $scope.goals);
                        // UPDATE COOKIE
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
                        // UPDATE COOKIE
                        for (i = 0; i < $scope.weekGoals1.length; i++) {
                            $scope.goals.weekGoals[$scope.currentWeek].push($scope.weekGoals1[i]);
                        }
                        $cookieStore.remove('user_data');
                        $cookieStore.put("user_data", $scope.goals);
                        // UPDATE COOKIE
                    });
                });
        ngDialog.close();
    };

    /// END OF GOAL CRUD   


    // OTHER EVENTS  
    $scope.click = function(id) {
        console.log(">>>>", id);
        DbActionsService.getRecord1('weekGoals', id).success(function(records) {
            $scope.weekGoal = records;
            //       console.log("......");
            console.log($scope.weekGoal);
            ngDialog.open({
                template: 'templates/directives/weekGoal.html',
                scope: $scope
            });
        });

    };
//    console.log("scope");
    //  console.log($scope.weekGoal);


    $scope.openAddWeekDialog = function() {
        $scope.weekGoal = {};
        var date = new Date();
        $scope.weekGoal.week = date.getWeek();
        $scope.weekGoal.month = date.getMonth();
        $scope.weekGoal.year = date.getFullYear();
        $scope.weekGoal.userId = $cookieStore.get('current_user').id;
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


