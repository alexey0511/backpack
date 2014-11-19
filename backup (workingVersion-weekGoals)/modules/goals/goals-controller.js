
var goalsModule = angular.module('goals-module', [
]);
goalsModule.controller('goalsController', function($scope, dateService, $cookieStore, ngDialog, DbActionsService, $location,
        /*ygRepository, mgRepository, wgRepository, YearGoalC, MonthGoalC, WeekGoalC, LoginService, Session,*/$rootScope) {
    /*
     *  1. Initial load
     *  1.1 Load week
     *  1.2 Load Goals
     *  1.2.2 If cookie exist from cookie
     *  1.2.3 If not exist from database, delete cookie
     *  2. Goal Functions (CRUD)
     */
// TEMPRORARY FUNCTION TO BE DELETED WHEN FIND A WAY HOW TO REPLACE
// 
// UPDATE COOKIE
    $scope.updateCookie = function(weekGoals, currentWeek) {
        // 
        console.log('...updateCookie...');
        $scope.userData.goals.weekGoals[currentWeek] = [];
        // CREATE COOKIE WITH WEEKGOALS
        for (i = 0; i < weekGoals.length; i++) {
            if (typeof(weekGoals[i]._id) !== 'undefined') {
                weekGoals[i].id = weekGoals[i]._id.$oid;
                //            delete weekGoals[i]._id;
                console.log("creating ID: ", weekGoals[i].id);
            } else {
                console.log("ID: ", weekGoals[i].id);
            }
        }
        $scope.userData.goals.weekGoals[currentWeek] = weekGoals;
        $cookieStore.remove('user_data');
        $cookieStore.put("user_data", $scope.userData.goals.weekGoals);

        for (i = 0; i < weekGoals.length; i++) {
            console.log("database");
            console.log(weekGoals[i].id);
            delete weekGoals[i]._id;
            DbActionsService.update('weekGoals', weekGoals[i].id, weekGoals[i]).success(function(result) {
       console.log(result.id);
   });
        }
    };
////////////////////////////////////
    // INITIALISE
    // DATES
    $scope.years = dateService.getYears();
    $scope.months = dateService.getMonths();
    $scope.weeks = dateService.getWeeks();
    $scope.currentWeek = dateService.getWeek(new Date());
    // user
    $scope.userData = {};
    $scope.userData.goals = {};
    $scope.userData.goals.weekGoals = {};
    // other
    $scope.totalCost = 0;
    $scope.actualCost = 0;
    // LOAD TASKS
    if ($cookieStore.get('current_user')) {
        console.log("-----USER: ", $cookieStore.get('current_user').email, "----");
        // TRY TO GET DATA FROM COOKIES
        if ($cookieStore.get('user_data')) {
            if ($cookieStore.get('user_data')) {
                console.log("--- LOADING DATA FROM COOKIE---");
                $scope.weekGoals = $cookieStore.get('user_data')[$scope.currentWeek];
                console.log($scope.weekGoals);
                console.log($cookieStore.get('user_data'));
            }
        } else {
            // IF NOT - CALL DATABASE
            console.log("--- COOKIE USER DATA DOESN'T EXIST---");
            var query = '{"userId": "' + $cookieStore.get('current_user').id + '"}';
            DbActionsService.getRecord('weekGoals', query).success(function(records) {
                $scope.weekGoals = records;
                $scope.updateCookie($scope.weekGoals, $scope.currentWeek);
            });
        }
    } else {
        console.log("NO COOKIE CALLED CURRENT_USER");
    }
    ;
//    console.log($cookieStore.get('user_data'));
    // END LOAD TASKS
    $scope.CurrentlyWorking = function() {
        // TO BE DEVELOPED
    };
    $scope.calculateTotalCosts = function() {
        // NOT CALCULATING FOR SOME REASON
//        if ($scope.totalCostsChk === true) {
//            for (var i in $scope.weekGoals) {
//                var weekGoal = $scope.weekGoals[i];
//                $scope.totalCost += weekGoal.cost;
//            }
//        } else {
//            $scope.totalCost = 0;
//        }
    };
    $scope.calculateTotalCostsActual = function() {
        // NOT WORKING
//        if ($scope.actualCostsChk == true) {
//            for (var i in $scope.weekGoals) {
//                var weekGoal = $scope.weekGoals[i];
//                var user = $cookieStore.get('current_user');
//                if (weekGoal.done === true) {
//                    $scope.actualCost += weekGoal.cost;
//                    user.score = parseInt(user.score) + parseInt(weekGoal.cost);
//                    $cookieStore.put('current_user', user);
//                }
//            }
//        } else {
//            $scope.actualCost = 0;
//        }
    };
// REMOVED FUNCTIONALIY 
// WEEKGOAL.WEEK

// GOAL CRUD 
    $scope.addWeekGoal = function() {
        // CHECK IF NAME IS THERE
        if (typeof ($scope.weekGoal.name) === 'undefined') {
            alert(' please enter name first');
            return;
        }
        // ASSIGN LAST PROPERTIES
        DbActionsService.create('weekGoals', $scope.weekGoal).success(function(newRecord) {
            console.log('creating new record');
            $scope.weekGoal = newRecord;
            $scope.weekGoals.push($scope.weekGoal);
            console.log($scope.weekGoals);
            //push to cookie
            $scope.updateCookie($scope.weekGoals, $scope.currentWeek);
// ClOSE WINDOW
            ngDialog.close();
        });
    }; // end add week goal 

    $scope.updateWeekGoal = function(id) {
        console.log("update");
        console.log($scope.weekGoal);
        delete $scope.weekGoal._id;
//        delete $scope.weekGoal.id;
        DbActionsService.update('weekGoals', $scope.weekGoal.id, $scope.weekGoal).success
                (function(updatedRecord) {
                    console.log("updated", updatedRecord);
                    $scope.weekGoals = {};
                    console.log("... retrieve existing records...");
                    DbActionsService.getAll('weekGoals').success(function(records) {
                        $scope.weekGoals = records;
                        console.log("week goals");
                        console.log($scope.weekGoals);
                        // UPDATE COOKIE
                                              $scope.updateCookie($scope.weekGoals, $scope.currentWeek);
                        // UPDATE COOKIE
                    });
                });
        ngDialog.close();
    };
    $scope.deleteWeekGoal = function(id) {
        DbActionsService.delete('weekGoals', id).success
                (function() {
                    $scope.weekGoals = {};
                    DbActionsService.getAll('weekGoals').success(function(records) {
                        console.log("deleted");
                        $scope.weekGoals = records;
                        // UPDATE COOKIE
                        $scope.updateCookie($scope.weekGoals, $scope.currentWeek);
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
            console.log("Click: ", $scope.weekGoal);
            ngDialog.open({
                template: 'templates/directives/weekGoal.html',
                scope: $scope
            });
        });
    };
//    console.log("scope");
    //  console.log($scope.weekGoal);


    $scope.openAddWeekDialog = function() {
        var date = new Date();
        $scope.weekGoal = {};
        // weekGoal
        $scope.weekGoal = {
            id: '',
            userId: $cookieStore.get('current_user').id,
            name: '',
            award: '',
            penalty: '',
            week: date.getWeek(),
            month: date.getMonth(),
            year: date.getFullYear(),
            active: false,
            cost: 0,
            description: '',
            responsible: 1,
            done: false
        };
        ngDialog.open({
            template: 'templates/directives/weekGoal.html',
            scope: $scope
        });
    };
    /* 
     * 
     * OLD CODE - TO BE DELETED
     */

    // old code
//    ygRepository.getAllyg().success(function(yg) {
//        $scope.yearGoals = yg;
//    });
//    mgRepository.getAllmg().success(function(mg) {
//        $scope.monthGoals = mg;
//    });
//    wgRepository.getAllwg().success(function(wg) {
//        $scope.weekGoals = wg;
//    });
//    // check if user is Authenticated
//    if (LoginService.isAuthenticated() || !LoginService.isAuthenticated()) {
//        // get user details from session
//        $scope.user = {
//            userId: 'test',
//            role: '',
//            authenticated: false
//        };
//
//        // called 9 times, find out why.......
//        $scope.checkAccess = function() {
//            if (typeof ($scope.user.userId) !== "undefined" && $scope.user.userId !== '') {
//                console.log($scope.user.userId);
//                return true;
//            } else {
//                console.log($scope.user.userId);
//                return false;
//            }
//        };



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

//        $scope.todos = [
//            {text: 'Learn AngularJS', done: false},
//            {text: 'Build an App', done: false}
//        ];
//        $scope.disableLists = function() {
//            if (typeof ($scope.monthGoal) === "undefined") {
//                // disable weeks list
//            }
//            if (typeof ($scope.yearGoal) === "undefined") {
//            }
//        };
//        $scope.disableLists();
//
//        $scope.getToDoTotals = function() {
//            return $scope.todos.length;
//        };
//
//        $scope.ClearCompleted = function() {
//            $scope.todos = _.filter($scope.todos, function(todo) {
//                return !todo.done;
//            });
//        };
//        $scope.addTodo = function() {
//            $scope.todos.push({text: $scope.formTodoText, done: false});
//            $scope.weekGoals.push({
//                name: $scope.formTodoText,
//                year: new Date().getFullYear(),
//                month: new Date().getMonth(),
//                week: '01',
//                done: false});
//            $scope.formTodoText = '';
//        };
//        $scope.addYearGoal = function() {
//            if (typeof ($scope.yearGoal) === 'undefined') {
//                alert(' please enter something first');
//                return;
//            }
//            if ($scope.yearGoals.length >= 3) {
//                alert("Too many goals for the year. slow down");
//                return;
//            }
//
////        $scope.yearGoals.push({
////            name: $scope.yearGoal.name,
////            year: new Date().getFullYear(),
////            award: $scope.yearGoal.award,
////            penalty: $scope.yearGoal.penalty,
////            done: false
////        });
//            YearGoalC.save(
//                    {
//                        name: $scope.yearGoal.name,
//                        year: new Date().getFullYear(),
//                        award: $scope.yearGoal.award,
//                        penalty: $scope.yearGoal.penalty,
//                        done: false
//
//                    });
//
//        };
//        $scope.addMonthGoal = function() {
//            if (typeof ($scope.monthGoal) === 'undefined') {
//                alert(' please enter something first');
//                return;
//            }
//            if ($scope.monthGoals.length >= 7) {
//                alert("Too many goals for the month. slow down");
//                return;
//            }
//
////        $scope.monthGoals.push({
////            name: $scope.monthGoal.name,
////            year: new Date().getFullYear(),
////            month: new Date().getMonth()+1,
////            award: $scope.monthGoal.award,
////            penalty: $scope.monthGoal.penalty,
////            done: false
////            });
//            MonthGoalC.save({
//                name: $scope.monthGoal.name,
//                year: new Date().getFullYear(),
//                month: new Date().getMonth() + 1,
//                award: $scope.monthGoal.award,
//                penalty: $scope.monthGoal.penalty,
//                done: false
//
//            });
//            console.log($scope.monthGoals);
//            $scope.formMonthGoalText = '';
//        };
//        $scope.addWeekGoal = function() {
//            if (typeof ($scope.weekGoal) === 'undefined') {
//                alert(' please enter something first');
//                return;
//            }
//
//
//            $scope.weekGoals.push({
//                name: $scope.weekGoal.name,
//                year: new Date().getFullYear(),
//                month: new Date().getMonth() + 1,
//                week: '01',
//                done: false});
//
//            WeekGoalC.save({
//                name: $scope.weekGoal.name,
//                year: new Date().getFullYear(),
//                month: new Date().getMonth() + 1,
//                week: '01',
//                done: false
//            });
//
//            console.log($scope.weekGoals);
//
//            $scope.formWeekGoalText = '';
//        };
//
//    } else {
//        $location.path('/login');
//    }
//
//
//
//    $scope.yearGoalCompleted = function(id) {
//        $scope.getObjectById(id);
////    console.log($scope.getObjectById(id));
//    };

}); // end of controller


