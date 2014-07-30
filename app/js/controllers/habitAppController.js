// HABBITS PAGE CONTROLLER
app.controller('HabitController', function($scope, $routeParams, habitRepository, HabitsC, Session) {

    $scope.HabitOpen = $routeParams.id;
$scope.habit1 = {};
//

///////////////////
// retrieve
    $scope.habitList = HabitsC.query();

    $scope.remove = function (habit) {                 //Cars['delete']({}, car); //alternate
    habit.$delete();
    alert('Habit removed. Refresh page to reflect changes.');
    };

//    $scope.add = function () {
//        var habit = new Habits({
//            name: $scope.carMake,
//            model: $scope.carModel
//          });
//        habit.$save();
        //Cars.save(car); //alternate method
//        alert('Car added. Refresh page to reflect changes.');
  //  };


//////////////////////////
//

// hardcoded data

    $scope.types = [
        {type: '21'},
        {type: '42'},
        {type: '63'}
    ];
    $scope.habitList =[];
$scope.test = new function () {
   habitRepository.getAllHabits().success(function(habits) {$scope.habitList = habits;}); 
          };
    //       
    //       
//    $scope.habitList = [
//        {
//            Habit: {
//                id: 1,
//                name: 'smoking',
//                award: 'apple',
//                penalty: '10$',
//                startDate: '24-07-2014',
//                endDate: '24-08-2014',
//                type: '21',
//                active: true,
//                days: new Object()
//            }
//        },
//        {
//            Habit: {
//                id: 2,
//                name: "running",
//                award: '',
//                penalty: '',
//                startDate: '20-06-2014',
//                endDate: '20-07-2014',
//                type: '42',
//                active: true,
//                days:
//                        {day: '20-06-2014',
//                            done: false}
//            }
//        }
//    ];
    $scope.Habit = {
        id: '',
        name: '',
        award: '',
        penalty: '',
        startDate: '',
        endDate: '',
        type: '',
        active: true,
        days: new Array()
    };
    $scope.getHabitDays = function(habit) {
var i = 0;
        var type = parseInt(habit.type);
        var day;
        var myDate;
        myDate = habit.startDate.split("-");
        if (myDate[2] < 32) {
            day = new Date(myDate[0], myDate[1] - 1, myDate[2]);
        } else {
            day = new Date(myDate[2], myDate[1] - 1, myDate[0]);
        }
        if (type>0 && type<64) {
        for (i; i <= type; i++) {
// gives an error. Maximum cycle is 10. scope provider, check later on
//                for (i; i <= 5; i++) {
            day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
            if (day.getTime() > new Date().getTime()) {
                habit.days[i] = {day: day, done: false};
            } else {
                habit.days[i] = {day: day, done: true};
            }
        }
    }
        console.log(habit);
    };
$scope.runG = new function() {
    var i=0;
    iMax = $scope.habitList.length;
for (i=0; i< iMax; i++) {
var habit = $scope.habitList[i].Habit;
//alert(habit.name);
$scope.getHabitDays(habit);
    }
};
 


//test1();


//// NORMALL CODE
    $scope.Habit.startDate = new Date();
    $scope.dateFinish = function(startDate, type) {
        var fd;

        if (typeof (type) === "undefined") {
            return;
        }
        if (type) {
            var nod = parseInt(type);
            if (startDate instanceof Date) {
                fd = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + nod - 1);
                //     fd.setDate(fd.getFullYear(), fd.getMonth(), fd.getDate() + nod);
            } else {
                var myDate = startDate;
                myDate = myDate.split("-");
                if (myDate[2] < 32) {
                    var nd = parseInt(myDate[2]) + nod - 1;
                    fd = new Date(myDate[0], myDate[1] - 1, nd);
                } else {
                    var nd = parseInt(myDate[0]) + nod - 1;
                    fd = new Date(myDate[2], myDate[1] - 1, nd);
                }
            }
            console.log(fd);
            return fd;
        } else {
            return "none";
        }

    };



    $scope.calculateCurrent = function(startDate) {
        var today = new Date();
        var sd;
        var sd1;
        var cd = 0;
        if (startDate instanceof Date) {
            sd = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        } else {
            sd1 = startDate.split("-");
            sd = new Date(sd1[0], sd1[1] - 1, sd1[2]);
            if (sd1.length <= 1) {
                sd1;
            }
        }
        cd = Math.floor((today.getTime() - sd.getTime()) / 86400000);
//          var cd = Math.floor((today.getTime() - sd.getTime()));
//alert("CD "+cd);
        return cd;
    };
    $scope.percentComplete = function(startDate, type) {
        if (type) {
            var pc = Math.floor($scope.calculateCurrent(startDate) / parseInt(type) * 100);
            if (pc > 100) {
                pc = 100;
            } else if (pc < 0) {
                pc = 0;
            }
//            alert(pc);
            return pc;
        }
    };
    $scope.resetHabit = function() {
        if (confirm("Do you want to start from beginning?")) {
            $scope.Habit.startDate = new Date();
        }
    };
    $scope.setHabit = function() {
        var Habit = new Object();
        Habit.id = $scope.habitList.length + 1;
        Habit.name = $scope.Habit.name;
        Habit.award = $scope.Habit.award;
        Habit.penalty = $scope.Habit.penalty;
        Habit.startDate = $scope.Habit.startDate;
        Habit.endDate = $scope.dateFinish($scope.Habit.startDate, $scope.numberOfDays);
        Habit.type = $scope.numberOfDays;
        Habit.active = true;
        var h = new Object();
        h.Habit = Habit;
        
        return h;
    };

    $scope.addHabit = function() {
        if ($scope.habitList.length >= 3) {
            alert("You've planty of habits to work on. \n please complete current one and you will be able to add new ones to the list");
        } else {
            var HabitNew = $scope.setHabit();
        HabitsC.save(HabitNew);
   habitRepository.getAllHabits().success(function(habits) {$scope.habitList = habits;}); 
        
        }
        //    $scope.resetHabit();
    };
    $scope.getObjectById = function(id) {
        var i = parseInt(id) - 1;
        return $scope.habitList[i];
    };
    
        $scope.habitComplete = function(id) {
     $scope.habit1 =   $scope.getObjectById(id);
     if ($scope.habit1.Habit.active === true) {
     $scope.habit1.Habit.active = false;
     Session.score = parseInt(Session.score)+100;
 }
  else {
     $scope.habit1.Habit.active = true;
  }
console.log(Session);
    };

    
}); // end of controller

