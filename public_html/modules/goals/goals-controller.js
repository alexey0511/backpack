
var goalsModule = angular.module('goals-module', [
]);
goalsModule.controller('goalsController', function($scope, dateService, $cookieStore,
        ngDialog, DbActionsService) {
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

    /*
     * 
     * supa dupa new code
     * 
     * 
     */
// UPDATE COOKIE
//    $scope.updateCookie = function(userData) {
//// 
//        $cookieStore.remove('user_data');
//        $cookieStore.put('user_data', $scope.userData.goals.weekGoals);
//        console.log('...updatedCookie...');
//    };
//    $scope.updateIndexes = function(object) {
//        // function to update indexes
//        // reassign _id to id
//        // delete _id
//    };
////////////////////////////////////
    // INITIALISE
    // DATES
    $scope.years = dateService.getYears();
    $scope.months = dateService.getMonths();
    $scope.weeks = dateService.getWeeks();
    var today = new Date();
    $scope.currentWeek = dateService.getWeek(today);
    $scope.currentMonth = today.getMonth() + 1;
    $scope.currentYear = today.getFullYear();
    // user
    $scope.userData = {};
    $scope.userData.goals = {};
    $scope.userData.goals.weekGoals = {};
    $scope.userData.goals.monthGoals = {};
    $scope.userData.goals.yearGoals = {};
    // other
    $scope.userData.goals.weekGoals.totalCost = 0;
    $scope.userData.goals.weekGoals.actualCost = 0;
    $scope.userData.goals.monthGoals.totalCost = 0;
    $scope.userData.goals.monthGoals.actualCost = 0;
    $scope.userData.goals.yearGoals.totalCost = 0;
    $scope.userData.goals.yearGoals.actualCost = 0;
    // LOAD TASKS
    if ($cookieStore.get('current_user')) {
        console.log("-----USER: ", $cookieStore.get('current_user').email, "----");
        // TRY TO GET DATA FROM COOKIES
        if ($cookieStore.get('user_data')) {
            if ($cookieStore.get('user_data')) {
                console.log("--- LOADING DATA FROM COOKIE---");
                $scope.userData = $cookieStore.get('user_data');
            }
        } else {
// IF NOT - CALL DATABASE
            console.log("--- COOKIE USER DATA DOESN'T EXIST---");
            var query = '{"userId": "' + $cookieStore.get('current_user').id + '"}';
            DbActionsService.getAll('weekGoals').success(function(records) {
                $scope.userData.goals.weekGoals = records;
                alert("1");
//                $scope.updateCookie($scope.userData.goals);
            });
            DbActionsService.getAll('monthGoals').success(function(records) {
                $scope.userData.goals.monthGoals = records;
            });
            DbActionsService.getAll('yearGoals').success(function(records) {
                $scope.userData.goals.yearGoals = records;
            });
        }
    } else {
        console.log("NO COOKIE CALLED CURRENT_USER");
    }
    ;
    // END LOAD TASKS
// WEEKGOAL.WEEK

// GOAL CRUD 
    $scope.addGoal = function(type) {
        DbActionsService.create(type, $scope.weekGoal).success(function(newRecord) {
            $scope.userData.goals[type + "Goal"] = newRecord;
            $scope.userData.goals[type + "Goal"].push($scope.weekGoal);
            //push to cookie
            $scope.updateCookie($scope.weekGoals, $scope.currentWeek);
// ClOSE WINDOW
            ngDialog.close();
        });
    }; // end add week goal 

    $scope.updateGoal = function(type, id, goal) {
        // update in database
        // update current
        // update cookie
    };
    $scope.deleteWeekGoal = function(id) {
        // delete database
        // delete current
        // delete cookie
        ngDialog.close();
    };
    /// END OF GOAL CRUD   

    // OTHER EVENTS  
    $scope.OpenExistingGoal = function(type, id) {
        // get data from current scope
        // pass data to the scope 
        ngDialog.open({
            template: 'templates/directives/weekGoal.html',
            scope: $scope
        });
    };
    $scope.openAddNewDialog = function(type) {
        // prepare template
        // open dialog with new template
        ngDialog.open({
            template: 'templates/directives/weekGoal.html',
            scope: $scope
        });
    };
    $scope.calculateTotalCosts = function(type) {
        $scope.userData.goals[type+'Goals']['totalCost'] = 0;
        // do calculations
        return $scope.userData.goals[type+'Goals']['totalCost'];
    };
    $scope.calculateTotalCostsActual = function(type) {
        $scope.userData.goals[type+'Goals']['actualCost'] = 0;
        // do calculations
        return $scope.userData.goals.weekGoals.actualCost;
    };
    
    /*
     * 
     *  END supa dupa new code
     * 
     * 
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
            if (typeof (weekGoals[i]._id) !== 'undefined') {
                weekGoals[i].id = weekGoals[i]._id.$oid;
            } else {
            }
        }
        $scope.userData.goals.weekGoals[currentWeek] = weekGoals;
        $cookieStore.remove('user_data');
        $cookieStore.put("user_data", $scope.userData.goals.weekGoals);
        for (z = 0; z < weekGoals.length; z++) {
            delete weekGoals[z]._id;
            console.log(weekGoals[z]);
            DbActionsService.update('weekGoals', weekGoals[z].id, weekGoals[z]).success(function(result) {
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
    $scope.userData.goals.monthGoals = {};
    $scope.userData.goals.yearGoals = {};
    // other
    $scope.userData.goals.weekGoals.totalCost = 0;
    $scope.userData.goals.weekGoals.actualCost = 0;
    // LOAD TASKS
    if ($cookieStore.get('current_user')) {
        console.log("-----USER: ", $cookieStore.get('current_user').email, "----");
        // TRY TO GET DATA FROM COOKIES
        if ($cookieStore.get('user_data')) {
            if ($cookieStore.get('user_data')) {
                console.log("--- LOADING DATA FROM COOKIE---");
                $scope.weekGoals = $cookieStore.get('user_data')[$scope.currentWeek];
                console.log($scope.weekGoals);
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
    // END LOAD TASKS
// WEEKGOAL.WEEK

// GOAL CRUD 
    $scope.addWeekGoal = function() {
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
        DbActionsService.update('weekGoals', id, $scope.weekGoal).success
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
    $scope.OpenExistingWeekGoal = function(id) {
        DbActionsService.getRecord1('weekGoals', id).success(function(records) {
            $scope.weekGoal = records;
            ngDialog.open({
                template: 'templates/directives/weekGoal.html',
                scope: $scope
            });
        });
    };
    $scope.openAddWeekDialog = function() {
        var date = new Date();
        $scope.weekGoal = {};
        $scope.weekGoal = {
            id: '',
            userId: $cookieStore.get('current_user').id,
            name: '',
            reward: '',
            penalty: '',
            week: $scope.currentWeek,
            month: date.getMonth() + 1,
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
    $scope.calculateTotalCosts = function() {
        $scope.userData.goals.weekGoals.totalCost = 0;
        for (var i in $scope.weekGoals) {
            var weekGoal = $scope.weekGoals[i];
            $scope.userData.goals.weekGoals.totalCost += parseInt(weekGoal.cost);
        }
        return $scope.userData.goals.weekGoals.totalCost;
    };
    $scope.calculateTotalCostsActual = function() {
        $scope.userData.goals.weekGoals.actualCost = 0;
        if ($cookieStore.get('current_user')) {
            var user = $cookieStore.get('current_user');
            for (var i in $scope.weekGoals) {
                var weekGoal = $scope.weekGoals[i];
                if (weekGoal.done === true) {
                    $scope.userData.goals.weekGoals.actualCost += parseInt(weekGoal.cost);
                    user.score = parseInt(user.score) + parseInt(weekGoal.cost);
                    $cookieStore.put('current_user', user);
                }
            }
        }
        return $scope.userData.goals.weekGoals.actualCost;
    };

    /*
     * END OF WEEK GOAL CODE
     */



    /*
     * 
     *  MONTH GOAL CODE
     * 
     * 
     */
// UPDATE COOKIE
    $scope.updateCookie = function(monthGoals, currentMonth) {
// 
        console.log('...updateCookie...');
        $scope.userData.goals.monthGoals[currentMonth] = [];
        // CREATE COOKIE WITH WEEKGOALS
        for (i = 0; i < monthGoals.length; i++) {
            if (typeof (monthGoals[i]._id) !== 'undefined') {
                monthGoals[i].id = monthGoals[i]._id.$oid;
            } else {
            }
        }
        $scope.userData.goals.monthGoals[currentMonth] = MonthGoals;
        $cookieStore.remove('user_data');
        $cookieStore.put("user_data", $scope.userData.goals.monthGoals);
        for (z = 0; z < monthGoals.length; z++) {
            delete monthGoals[z]._id;
            console.log(monthGoals[z]);
            DbActionsService.update('monthGoals', monthGoals[z].id, monthGoals[z]).success(function(result) {
            });
        }
    };
////////////////////////////////////
    // INITIALISE
    // DATES
    $scope.today = new Date();
    $scope.currentMonth = $scope.today.getMonth() + 1;
    // user
    // other
    $scope.userData.goals.monthGoals.totalCost = 0;
    $scope.userData.goals.monthGoals.actualCost = 0;
    // LOAD TASKS
    if ($cookieStore.get('current_user')) {
        console.log("-----USER: ", $cookieStore.get('current_user').email, "----");
        // TRY TO GET DATA FROM COOKIES
        if ($cookieStore.get('user_data')) {
            if ($cookieStore.get('user_data')) {
                console.log("--- LOADING DATA FROM COOKIE---");
                $scope.monthGoals = $cookieStore.get('user_data')[$scope.currentMonth];
                console.log($scope.monthGoals);
            }
        } else {
// IF NOT - CALL DATABASE
            console.log("--- COOKIE USER DATA DOESN'T EXIST---");
            var query = '{"userId": "' + $cookieStore.get('current_user').id + '"}';
            DbActionsService.getRecord('monthGoals', query).success(function(records) {
                $scope.monthGoals = records;
                $scope.updateCookie($scope.monthGoals, $scope.currentMonth);
            });
        }
    } else {
        console.log("NO COOKIE CALLED CURRENT_USER");
    }
    ;
    // END LOAD TASKS
// WEEKGOAL.WEEK

// GOAL CRUD 
    $scope.addMonthGoal = function() {
        DbActionsService.create('monthGoals', $scope.monthGoal).success(function(newRecord) {
            console.log('creating new record');
            $scope.monthGoal = newRecord;
            $scope.monthGoals.push($scope.monthGoal);
            console.log($scope.monthGoals);
            //push to cookie
            $scope.updateCookie($scope.monthGoals, $scope.currentMonth);
// ClOSE WINDOW
            ngDialog.close();
        });
    }; // end add week goal 

    $scope.updateMonthGoal = function(id) {
        console.log("update");
        console.log($scope.monthGoal);
        delete $scope.monthGoal._id;
//        delete $scope.weekGoal.id;
        DbActionsService.update('monthGoals', id, $scope.weekGoal).success
                (function(updatedRecord) {
                    console.log("updated", updatedRecord);
                    $scope.monthGoals = {};
                    console.log("... retrieve existing records...");
                    DbActionsService.getAll('monthGoals').success(function(records) {
                        $scope.monthGoals = records;
                        console.log("week goals");
                        console.log($scope.monthGoals);
                        // UPDATE COOKIE
                        $scope.updateCookie($scope.monthGoals, $scope.currentMonth);
                        // UPDATE COOKIE
                    });
                });
        ngDialog.close();
    };
    $scope.deleteMonthGoal = function(id) {
        DbActionsService.delete('monthGoals', id).success
                (function() {
                    $scope.monthGoals = {};
                    DbActionsService.getAll('monthGoals').success(function(records) {
                        console.log("deleted");
                        $scope.monthGoals = records;
                        // UPDATE COOKIE
                        $scope.updateCookie($scope.monthGoals, $scope.currentMonth);
                        // UPDATE COOKIE
                    });
                });
        ngDialog.close();
    };
    /// END OF GOAL CRUD   

    // OTHER EVENTS  
    $scope.OpenExistingMonthGoal = function(id) {
        DbActionsService.getRecord1('monthGoals', id).success(function(records) {
            $scope.monthGoal = records;
            ngDialog.open({
                template: 'templates/directives/monthGoal.html',
                scope: $scope
            });
        });
    };
    $scope.openAddMonthDialog = function() {
        var date = new Date();
        $scope.monthGoal = {};
        $scope.monthGoal = {
            id: '',
            userId: $cookieStore.get('current_user').id,
            name: '',
            reward: '',
            penalty: '',
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            active: false,
            cost: 0,
            description: '',
            responsible: 1,
            done: false
        };
        ngDialog.open({
            template: 'templates/directives/monthGoal.html',
            scope: $scope
        });
    };
    $scope.calculateTotalCostsMonth = function() {
        $scope.userData.goals.monthGoals.totalCost = 0;
        for (var i in $scope.monthGoals) {
            var monthGoal = $scope.monthGoals[i];
            $scope.userData.goals.monthGoals.totalCost += parseInt(monthGoal.cost);
        }
        return $scope.userData.goals.monthGoals.totalCost;
    };
    $scope.calculateTotalCostsActualMonth = function() {
        $scope.userData.goals.monthGoals.actualCost = 0;
        if ($cookieStore.get('current_user')) {
            var user = $cookieStore.get('current_user');
            for (var i in $scope.MonthGoals) {
                var monthGoal = $scope.monthGoals[i];
                if (monthGoal.done === true) {
                    $scope.userData.goals.monthGoals.actualCost += parseInt(monthGoal.cost);
                    user.score = parseInt(user.score) + parseInt(monthGoal.cost);
                    $cookieStore.put('current_user', user);
                }
            }
        }
        return $scope.userData.goals.monthGoals.actualCost;
    };


    /*
     * 
     *  END OF MONTH GOAL CODE
     * 
     * 
     */
}); // end of controller


/*
 * 
 * DIRECTIVES
 * 
 * 
 */

goalsModule.directive('goalForm', function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    type: '@',
                    userData: '@',
                    values: '@'
                },
                transclude: true,
//                templateUrl: 'modules/goals/goal.html'
                templateUrl: 'templates/directives/goal.html'

//  template: '<div>hello</div>'
            };
        });
