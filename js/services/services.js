// SESSION

app.service('Session', function() {
    this.create = function(sessionId, userId, userRole, score) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
        this.score = score;
    };
    this.destroy = function() {
        this.id = null;
        this.userId = null;
        this.userRole = null;
        this.score = null;
    };
    return this;
});

// LOGIN

app.factory('LoginService', function($http, Session) {
    var loginService = {};
    loginService.getUser = function(username) {
        if (username !== 'undefined') {
        var url = 'https://api.mongolab.com/api/1/databases/better-you/collections/users?q={"username": "' + username +
                '"}&apiKey=Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo';
            console.log(url);
        return $http.get(url);
    }
    };
    loginService.login = function(user) {
        var url = 'https://api.mongolab.com/api/1/databases/better-you/collections/users?q={"username": "' + user.username +
                '"}&apiKey=Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo';
     
        return $http.get(url);
    };
    loginService.isAuthenticated = function() {
if (Session.userId) {
//    console.log(Session);
} else {
//    console.log("not signed");
}
return !!Session.userId;
    };
    loginService.isAuthorized = function(authorizedRoles) {
//        if (!app.isArray(authorizedRoles)) {
//            authorizedRoles = [authorizedRoles];
//        }
//        return (authService.isAuthenticated() &&
//                authorizedRoles.indexOf(Session.userRole) !== -1);
    };
    return loginService;
});




app.factory('userRepository', function($http) { 
    return {
        getAllUsers: function() {
var url = "https://api.mongolab.com/api/1/databases/better-you/collections/users?apiKey=Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo";
return $http.get(url);
// https://api.mongolab.com/api/1/databases?apiKey=<your-api-key>
  //        { apiKey: 'Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo' }, {
        }
    };
});
app.factory('ygRepository', function($http) { 
    return {
        getAllyg: function() {
var url = "https://api.mongolab.com/api/1/databases/better-you/collections/yearGoals?apiKey=Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo";
return $http.get(url);
// https://api.mongolab.com/api/1/databases?apiKey=<your-api-key>
  //        { apiKey: 'Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo' }, {
        }
    };
});
app.factory('mgRepository', function($http) { 
    return {
        getAllmg: function() {
var url = "https://api.mongolab.com/api/1/databases/better-you/collections/monthGoals?apiKey=Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo";
return $http.get(url);
        }
    };
});
app.factory('wgRepository', function($http) { 
    return {
        getAllwg: function() {
var url = "https://api.mongolab.com/api/1/databases/better-you/collections/weekGoals?apiKey=Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo";
return $http.get(url);
        }
    };
});
///
app.factory('habitRepository', function($http) { 
    return {
        getAllHabits: function() {
var url = "https://api.mongolab.com/api/1/databases/better-you/collections/habits?apiKey=Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo";
return $http.get(url);
        }
    };
});
app.factory('HabitsC', function($resource) {
      var Habits = $resource('https://api.mongolab.com/api/1/databases/' +
          '/better-you/collections/habits/:id',
          { apiKey: 'Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo' }, {
            id:'@_id.$oid'
    });
    return Habits;
    });
app.factory('YearGoalC', function($resource) {
      var YearGoal = $resource('https://api.mongolab.com/api/1/databases/' +
          '/better-you/collections/yearGoals/:id',
          { apiKey: 'Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo' }, {
            id:'@_id.$oid'
    });
    return YearGoal;
    });
app.factory('MonthGoalC', function($resource) {
      var MonthGoal = $resource('https://api.mongolab.com/api/1/databases/' +
          '/better-you/collections/monthGoals/:id',
          { apiKey: 'Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo' }, {
            id:'@_id.$oid'
    });
    return MonthGoal;
    });
app.factory('WeekGoalC', function($resource) {
      var WeekGoal = $resource('https://api.mongolab.com/api/1/databases/' +
          '/better-you/collections/weekGoals/:id',
          { apiKey: 'Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo' }, {
            id:'@_id.$oid'
    });
    return WeekGoal;
    });
    

