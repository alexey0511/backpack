
var goalsModule = angular.module('goals-module', [
]);
goalsModule.directive("task", function (ngDialog, $location)
{
    return {
        restrict: "EA",
        templateUrl: "./modules/goals/task.html",
        replace: true,
        tranclude: true,
        scope: true,
        link: function (scope, element, attrs) {
            scope.task = {};
            scope.task = scope[attrs["source"]];
            scope.openTaskDialog = function () {
$location.path("/goals/"+scope.task.id);                
//                ngDialog.open({
//                    template: 'modules/goals/editTaskDialog.html',
//                    scope: scope,
//                    controller: 'taskDialogController'
//                });
            };
        }
    };
});
goalsModule.controller("taskDialogController", function ($scope, dateService, $rootScope, $routeParams) {
$scope.task = {};
$scope.task.id = $routeParams.id;
var lookup = {};
for (var i = 0, len = $scope.yearGoals.length; i < len; i++) {
    lookup[$scope.yearGoals[i].id] = $scope.yearGoals[i];
}
console.log(lookup);

console.log(lookup[$routeParams.id]);
$scope.task = lookup[$routeParams.id];    
        $rootScope.ui.task = true;
    $scope.taskHideShow = function () {
        $rootScope.ui.task = !$rootScope.ui.task;
    }

    $rootScope.ui.showTask = 
            function() {
        
    }
    $scope.newTask = {};
    $scope.newTask.userId = $rootScope.user.id;
    $scope.newTask.week = $rootScope.today.week;
    $scope.newTask.month = $rootScope.today.month;
    $scope.newTask.year = $rootScope.today.year;
    $scope.newTask.cost = 1;
    $scope.newTask.type = $scope.type;
    $scope.newTask.id = "tempId";
    $scope.weeks = dateService.getWeeks();
    $scope.months = dateService.getMonths();
    $scope.years = dateService.getYears();
    $scope.editTask = function () {
        $scope.closeThisDialog(true);
    };
    $scope.deleteTask = function () {
        if (confirm("Are you sure?")) {
            var index = $rootScope[$scope.task.type + "Goals"].indexOf($scope.task);
            if (index > -1) {
                $rootScope[$scope.task.type + "Goals"].splice(index, 1);
                $scope.closeThisDialog(true);

            } else {
                $rootScope.error = "Problem with deleting the item";
            }
        }
    };

    $scope.addNewTask = function () {
        var a = $scope.newTask.type;
        var flag = false;
        var array = $rootScope[a + 'Goals'];
        for (var i = 0; i <= array.length - 1; i++)
        {
            if ($scope.newTask.name == array[i].name) {
                flag = true;
            }
        }
        if (flag == false) {
            $rootScope[a + "Goals"].push($scope.newTask);
            $scope.newTask = {};
            $scope.closeThisDialog(true);
        } else {
            $rootScope.error = "The task is already exists";
        }
        console.log("----------");
//            console.log($rootScope[a+"Goals"]);

    };
});
goalsModule.directive("taskList", function ($rootScope, ngDialog)
{
    return {
        restrict: "EA",
        templateUrl: "./modules/goals/goal-list.html",
        replace: true,
        tranclude: true,
        scope: true,
        link: function (scope, element, attrs) {
            scope.calc = {};
            scope.type = attrs['type'];
            scope.periodNumber = $rootScope.today[scope.type];
            scope.data = [];
            scope.$watch(scope.type + 'Goals', function (newVal) {
                if (newVal) {
                    scope.periodNumber = $rootScope.today[scope.type];
                    scope.data = $rootScope[scope.type + "Goals"];
                }
            });

            scope.currentPeriod = function () {
            };
            scope.calculateTotalCosts = function () {
                scope.calc.totalCost = 0;
                var tasks = new Array();
                tasks = $rootScope[scope.type + "Goals"];
                if (typeof tasks != "undefined" && tasks != null && tasks.length > 0) {
                    for (var i = 0; i <= tasks.length - 1; i++) {
                        var item = tasks[i];
                        if (item[scope.type] == scope.periodNumber) {
                            scope.calc.totalCost += item['cost'];
//                        console.log(scope.calc.totalCost);
                        }
                    }
                }
                return scope.calc.totalCost;
            };
            scope.calculateTotalCostsActual = function () {
                scope.calc.actualCost = 0;
                var tasks = new Array();
                tasks = $rootScope[scope.type + "Goals"];
                if (typeof tasks != "undefined" && tasks != null && tasks.length > 0) {
                    for (var i = 0; i <= tasks.length - 1; i++) {
                        var item = tasks[i];
                        if (item[scope.type] == scope.periodNumber && item[scope.done] === true) {
                            scope.calc.actualCost += item['cost'];
//                        console.log(scope.calc.totalCost);
                        }
                    }
                }
                return scope.calc.actualCost;
            };
            scope.openAddGoalDialog = function () {
                console.log(scope);
                ngDialog.open({
                    template: 'modules/goals/newTaskDialog.html',
                    scope: scope,
                    controller: 'taskDialogController'
                });
            };
        }
    };
});
goalsModule.controller('goalsController', function ($scope, dateService, $cookieStore,
        ngDialog, DbActionsService, $rootScope, $http) {
    $rootScope.weekGoals = null;
    $rootScope.monthGoals = null;
    $rootScope.yearGoals = null;
    $http.get("api/weekGoals.json")
            .success(function (data) {
                $rootScope.weekGoals = data;
                console.log("Step 2: Goals are loaded and displayed");
            }).error(function () {
        alert("ERROR LOADING DATA");
    });
    $http.get("api/monthGoals.json")
            .success(function (data) {
                $rootScope.monthGoals = data;
                console.log("Step 3: Month goals are loaded and displayed");
            }).error(function () {
        alert("ERROR LOADING DATA");
    });
    $http.get("api/yearGoals.json")
            .success(function (data) {
                $rootScope.yearGoals = data;
                console.log("Step 4: Year goals are loaded and displayed");
            }).error(function () {
        alert("ERROR LOADING DATA");
    });
    /*
     *  1. Initial load
     *  1.1 Load week
     *  1.2 Load Goals
     *  1.2.2 If cookie exist from cookie
     *  1.2.3 If not exist from database, delete cookie
     *  2. Goal Functions (CRUD)
     *  3. Additional functions
     *  3.1 Open Add new week goal dialog
     *  3.2 Open Edit existing week goal dialog
     *  3.3 Calculate totals
     *  3.4 Calculate actuals
     */

////////////////////////////////////
    // INITIALISE
    // DATES

//    $scope.years = dateService.getYears();
//    $scope.months = dateService.getMonths();
//    $scope.weeks = dateService.getWeeks();
//    $scope.currentWeek = dateService.getWeek(new Date());
//    // user
//    $scope.userData = {};
//    $scope.userData.goals = {};
//    $scope.userData.goals.weekGoals = {};
//    $scope.userData.goals.monthGoals = {};
//    $scope.userData.goals.yearGoals = {};
//    // other
//    $scope.userData.goals.weekGoals.totalCost = 0;
//    $scope.userData.goals.weekGoals.actualCost = 0;
//    // LOAD TASKS
//    if ($cookieStore.get('current_user')) {
//        console.log("-----USER: ", $cookieStore.get('current_user').email, "----");
//        // TRY TO GET DATA FROM COOKIES
//        if ($cookieStore.get('user_data')) {
//            if ($cookieStore.get('user_data')) {
//                console.log("--- LOADING DATA FROM COOKIE---");
//                $scope.weekGoals = $cookieStore.get('user_data')[$scope.currentWeek];
//                console.log($scope.weekGoals);
//            }
//        } else {
//// IF NOT - CALL DATABASE
//            console.log("--- COOKIE USER DATA DOESN'T EXIST---");
//            var query = '{"userId": "' + $cookieStore.get('current_user').id + '"}';
//            DbActionsService.getRecord('weekGoals', query).success(function(records) {
//                $scope.weekGoals = records;
//                $scope.updateCookie($scope.weekGoals, $scope.currentWeek);
//            });
//        }
//    } else {
//        console.log("NO COOKIE CALLED CURRENT_USER");
//    }
//    ;
//    // END LOAD TASKS
//// WEEKGOAL.WEEK
//
//// GOAL CRUD 
//    $scope.addWeekGoal = function() {
//        DbActionsService.create('weekGoals', $scope.weekGoal).success(function(newRecord) {
//            console.log('creating new record');
//            $scope.weekGoal = newRecord;
//            $scope.weekGoals.push($scope.weekGoal);
//            console.log($scope.weekGoals);
//// ClOSE WINDOW
//            ngDialog.close();
//        });
//    }; // end add week goal 
//
//    $scope.updateWeekGoal = function(id) {
//        console.log("update");
//        console.log($scope.weekGoal);
//        delete $scope.weekGoal._id;
////        delete $scope.weekGoal.id;
//        DbActionsService.update('weekGoals', id, $scope.weekGoal).success
//                (function(updatedRecord) {
//                    console.log("updated", updatedRecord);
//                    $scope.weekGoals = {};
//                    console.log("... retrieve existing records...");
//                    DbActionsService.getAll('weekGoals').success(function(records) {
//                        $scope.weekGoals = records;
//                        console.log("week goals");
//                        console.log($scope.weekGoals);
//                        // UPDATE COOKIE
//                        $scope.updateCookie($scope.weekGoals, $scope.currentWeek);
//                        // UPDATE COOKIE
//                    });
//                });
//        ngDialog.close();
//    };
//    $scope.deleteWeekGoal = function(id) {
//        DbActionsService.delete('weekGoals', id).success
//                (function() {
//                    $scope.weekGoals = {};
//                    DbActionsService.getAll('weekGoals').success(function(records) {
//                        console.log("deleted");
//                        $scope.weekGoals = records;
//                        // UPDATE COOKIE
//                        $scope.updateCookie($scope.weekGoals, $scope.currentWeek);
//                        // UPDATE COOKIE
//                    });
//                });
//        ngDialog.close();
//    };
//    /// END OF GOAL CRUD   
//
//    // OTHER EVENTS  
//    $scope.OpenExistingWeekGoal = function(id) {
//        DbActionsService.getRecord1('weekGoals', id).success(function(records) {
//            $scope.weekGoal = records;
//            ngDialog.open({
//                template: 'templates/directives/weekGoal.html',
//                scope: $scope
//            });
//        });
//    };
//    $scope.openAddWeekDialog = function() {
//        var date = new Date();
//        $scope.weekGoal = {};
//        $scope.weekGoal = {
//            id: '',
//            userId: $cookieStore.get('current_user').id,
//            name: '',
//            reward: '',
//            penalty: '',
//            week: $scope.currentWeek,
//            month: date.getMonth() + 1,
//            year: date.getFullYear(),
//            active: false,
//            cost: 0,
//            description: '',
//            responsible: 1,
//            done: false
//        };
//        ngDialog.open({
//            template: 'templates/directives/weekGoal.html',
//            scope: $scope
//        });
//    };
//    $scope.calculateTotalCosts = function() {
//        $scope.userData.goals.weekGoals.totalCost = 0;
//        for (var i in $scope.weekGoals) {
//            var weekGoal = $scope.weekGoals[i];
//            $scope.userData.goals.weekGoals.totalCost += parseInt(weekGoal.cost);
//        }
//        return $scope.userData.goals.weekGoals.totalCost;
//    };
//    $scope.calculateTotalCostsActual = function() {
//        $scope.userData.goals.weekGoals.actualCost = 0;
//        if ($cookieStore.get('current_user')) {
//            var user = $cookieStore.get('current_user');
//            for (var i in $scope.weekGoals) {
//                var weekGoal = $scope.weekGoals[i];
//                if (weekGoal.done === true) {
//                    $scope.userData.goals.weekGoals.actualCost += parseInt(weekGoal.cost);
//                    user.score = parseInt(user.score) + parseInt(weekGoal.cost);
//                    $cookieStore.put('current_user', user);
//                }
//            }
//        }
//        return $scope.userData.goals.weekGoals.actualCost;
//    };
//
});
