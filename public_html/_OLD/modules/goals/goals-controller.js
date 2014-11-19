
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

        });
