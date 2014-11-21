
var goalsModule = angular.module('goals-module', [
]);
goalsModule.filter("goalsFilter", function () {
    return function (goals, type, periodNumber, selected) {
        var filtered = [];
        if (angular.isDefined(type) && angular.isDefined(periodNumber)) {
            angular.forEach(goals, function (goal) {
                if (type === goal.type && goal[type] == periodNumber) {
                    if (angular.isDefined(selected) && selected != null && selected != "") {
                        switch (selected.type) {
                            case "week":
                                filtered.push(goal);
                                break;
                            case "month":
                                if ((selected.id === goal.parent_goal) || (selected.id === goal.id) ||
                                        (selected.parent_goal == goal.id)) {
                                    filtered.push(goal);
                                }
                                break;
                            case "year":

                                if ((selected.id === goal.parent_goal) || (selected.id === goal.id)) {
                                    filtered.push(goal);
                                }
                                break;
                            default:
                        }
                    } else {
                        if (type === goal.type && goal[type] == periodNumber) {
                            filtered.push(goal);
                        }
                    }
                }
            });
        } else {
            filtered = goals;
        }
        return filtered;
    };
});
goalsModule.controller("taskDialogController", function ($scope, FBService, goalsService, lsService, dateService, $rootScope, $routeParams, $location, idService) {
// NEW EXP
    $rootScope.weeks = dateService.getWeeks();
    $rootScope.months = dateService.getMonths();
    $rootScope.years = dateService.getYears();
    $scope.task = {};
    $scope.task.id = $routeParams.id;
//BOF
//Check if friends available
    FBService.getPermissions(function () {
        if (FBService.hasPermission('user_friends')) {
            FBService.getFriends();
        } else {
            FBService.reRequest('user_friends');
        }
    });
    // EOF

//    var lookup = {};
//    for (var i = 0, len = $scope.goals.length; i < len; i++) {
//        lookup[$scope.goals[i].id] = $scope.goals[i];
//    }
//    $scope.task = lookup[$routeParams.id];
    $scope.task = $rootScope.goals[$routeParams.id];
    console.log($scope.task);
    $scope.parentGoals = [];
    if ($scope.task.type === 'week') {
        angular.forEach($rootScope.goals, function (goal) {
            if (goal.type === 'month') {
                $scope.parentGoals.push(goal);
            }
        });
    } else if ($scope.task.type === 'month') {
        angular.forEach($rootScope.goals, function (goal) {
            if (goal.type === 'year') {
                $scope.parentGoals.push(goal);
            }
        });
    }
    ;
    $rootScope.ui.task = true;
    $scope.taskHideShow = function () {
        $rootScope.ui.task = !$rootScope.ui.task;
    };
//// SETTING UP NEW TASK Variable    
    $scope.editTask = function (task) {
        task.new = false;
        task.id = idService.generate();
        delete $rootScope.goals['new'];
        $rootScope.goals[task.id] = task;
        lsService.saveGoals();
        if ($rootScope.online) {
            goalsService.saveGoals();
        }
        else {
            console.log("Can't save record to remote location");
            $rootScope.messsage("Can't save record to remote location when Offline");
        }        // go back to goals
        $location.path("/goals");
    };
    $scope.deleteTask = function (task) {
        if (confirm("Are you sure?")) {
//            var parents = [];
//            angular.forEach($rootScope.goals, function (goal) {
//                if (goal.parent_goal === task.id) {
//                    parents.push(goal);
//                }
//            });
//            if (parents.length > 0) {
//                console.log(parents);
//                $rootScope.messsage = "Cannot delete goal because it has child goals";
//                console.log("Cannot delete goal because it has child goals");
//                alert("Cannot delete goal because it has a sub tasks");
//            } else {
            delete $rootScope.goals[task.id];
            lsService.saveGoals();
            goalsService.saveGoals();
            $location.path('/goals');
//            }
        }
        ;
    };
});
goalsModule.controller('goalsController', function ($scope, $document, goalsService, lsService, $rootScope, DbActionsService, lsService, $http, $location, dateService, FBService) {

    $scope.sendBrag = function (caption) {
        FB.ui({method: 'feed',
            caption: caption,
            picture: '',
            name: 'Testing facebook'
        }, function () {
            console.log("posting done");
        });
    };
    $rootScope.goals = {};
    var goals_loading = {};
    $rootScope.goals.last_modified = 0;
    if (lsService.getGoals()) {
        goals_loading = lsService.getGoals();
        if (!goals_loading['last_modified']) {
            goals_loading['last_modified'] = 1;
        }
        if (goals_loading.last_modified > $rootScope.goals.last_modified) {
            $rootScope.goals = goals_loading.goals;
            console.log("Loading goals from localStorage: complete");
        }
    }
    if ($rootScope.online) {
//                $http.get("api/goals.json")
        goalsService.getGoals()
                .success(function (data) {
                    if (data.last_modified) {
                        if (data.last_modified > $rootScope.goals.last_modified) {
                            $rootScope.goals = data;
                            lsService.saveGoals($rootScope.goals);
                        } else {
                            goalsService.saveGoals($rootScope.goals);
                            ;
                        }
                    } else {
                        goalsService.saveGoals($rootScope.goals);
                        ;
                    }
                }).error(function (data) {
            if (data.message = "Document not found") {
                goalsService.saveGoals($rootScope.goals);
            } else {
                alert("ERROR LOADING DATA");
            }
        });
    } else {
        console.log("Can't access remote location, status offline");
    }
    $rootScope.weeks = dateService.getWeeks();
    $rootScope.months = dateService.getMonths();
    $rootScope.years = dateService.getYears();
    $scope.openTaskDialog = function (task) {
        console.log("TAAAASK", task)
        $location.path("/goals/" + task.id);
    };
});
// Directives
goalsModule.directive("task", function ($location)
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
                $location.path("/goals/" + scope.task.id);
            };
        }
    };
});
goalsModule.directive("taskList", function ($rootScope, goalsService, ngDialog, $location, dateService, idService, lsService)
{
    return {
        restrict: "EA",
        templateUrl: "./modules/goals/goal-list.html",
        replace: true,
        tranclude: true,
        scope: true,
        link: function (scope, element, attrs) {

            scope.doneDiag = function (task) {
                if (task.done) {
                    ngDialog.open({
                        template: 'modules/goals/DialogComplete.html',
                        scope: scope})
                }
            };
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
            scope.selectGoal = function (task) {
                if (task.active === true) {
                    $rootScope.goal_selected = task;
                } else {
                    $rootScope.goal_selected = null;
                }
                ;
            };
            scope.calculateTotalCosts = function (tasks) {
                scope.calc.totalCost = 0;
                if (typeof tasks != "undefined" && tasks != null && Object.getOwnPropertyNames(tasks).length !== 0) {
                    angular.forEach(tasks, function (task) {
                        if (scope.type == task.type &&
                                scope.periodNumber == task[scope.type]) {
                            scope.calc.totalCost += task.cost;
                        }
                    });
                }
                return scope.calc.totalCost;
            };
            scope.calculateTotalCostsActual = function (tasks) {
                scope.calc.actualCost = 0;
                if (typeof tasks != "undefined" && tasks != null && Object.getOwnPropertyNames(tasks).length !== 0) {
                    angular.forEach(tasks, function (task) {
                        if (scope.type == task.type &&
                                scope.periodNumber == task[scope.type] &&
                                task.done === true) {
                            scope.calc.actualCost += task.cost;
                        }
                    });
                }
                return scope.calc.actualCost;
            };
            scope.openAddGoalDialog = function (type, parent) {
                if (type === 'week' && scope.calc.totalCost > 50) {
                    alert("Relax, you are already busy for this week");
                } else {
                    scope.newTask = {
                        id: 'new',
                        userId: $rootScope.user.id,
                        type: type,
                        week: $rootScope.today.week,
                        month: $rootScope.today.month,
                        year: $rootScope.today.year,
                        cost: 1,
                        parent_goal: parent,
                        new : true
                    };
                    $rootScope.goals[scope.newTask.id] = scope.newTask;
                    lsService.saveGoals();
                    if ($rootScope.online) {
                        goalsService.saveGoals();
                    } else {
                        console.log("Can't save record to remote location");
                        $rootScope.messsage("Can't save record to remote location when Offline");
                    }
                    $location.path("/goals/new");
                }
            }

            scope.openAddGoalDialogChild = function (task) {
                var type1;
                var cost
                switch (task.type) {
                    case "year":
                        type1 = 'month';
                        cost = '';
                        break;
                    case "month":
                        type1 = 'week';
                        cost = 1;
                        break;
                    default:
                }
                scope.newTask = {
                    id: idService.generate(),
                    userId: $rootScope.user.id,
                    type: type1,
                    week: task.week,
                    month: task.month,
                    year: task.year,
                    cost: cost,
                    parent_goal: task.id,
                    new : true
                };
                $rootScope.goals[scope.newTask.id] = scope.newTask;
                // save to local storage
                lsService.saveGoals();
                if ($rootScope.online) {
                    goalsService.saveGoals();
                } else {
                    console.log("Can't save record to remote location");
                    $rootScope.messsage("Can't save record to remote location when Offline");
                }
                $location.path("/goals/" + scope.newTask.id);
            };
        }
    };
});
