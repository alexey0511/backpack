app.factory('dateService', function() {
    var ds = {};
    ds.getWeeks = function() {
        var weeks = [];
        for (i = 1; i <= 52; i++) {
            weeks.push(i);
        }
        return weeks;

    };
    ds.getYears = function() {
        var years = [];
        for (i = 2014; i <= 2020; i++) {
            years.push(i);
        }
        return years;
    };
    ds.getWeek = function(date) {
        var week = 0;
        Date.prototype.getWeek = function() {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() - 1) / 7);
        };
        week = date.getWeek();


        return week;
    };
    ds.getMonths = function() {
        var months = [];
        months = [
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
        return months;
    };
    return ds;
});



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

// USER SERVICE
app.factory('userService', function($http, appConfig) {
    var userService = {};
    userService.getUser = function(user) {
        var url = 'https://api.mongolab.com/api/1/databases/better-you/collections/users?q={"username": "' + user.id +
                '"}&apiKey=' + appConfig.DbId;
        return $http.get(url);
    };
    userService.create = function(user) {
        console.log("create user");
        ////
        var url = 'https://api.mongolab.com/api/1/databases/better-you/collections/users?apiKey=' + appConfig.DbId;
        console.log(url);
        $http.post(url, user)
                .success(function(data, status, headers, config) {
                })
                .error(function(data, status, headers, config) {
                    alert(status);
                });
        ;
    };
    userService.delete = function(id) {
        var appId;
        console.log("delete user");
        var url = "https://api.mongolab.com/api/1/databases/better-you/collections/" + id + "?apiKey=" + appConfig.DbId;
        $http.delete(url);
    };

    userService.update = function(id, attrs) {
        $http.put('https://api.mongolab.com/api/1/databases/better-you/collections/users' +
                id + '?apiKey=' + appConfig.DbId,
                attrs).success(function(data, status, headers, config) {
        }).error(function(data, status, headers, config) {
            alert(status);
        });

    };
    return userService;
}); // end of user service


// Database Actions SERVICE
app.factory('DbActionsService', function($http, appConfig) {
    var DbActionsService = {};
    DbActionsService.getRecord = function(table, query) {
        var url = appConfig.DbUrl + appConfig.DbPath + table +
                '?q=' + query + '&apiKey=' + appConfig.DbId;
        return $http.get(url);
    };
    DbActionsService.create = function(table, record) {
        if (record.hasOwnProperty("_id")) {
            console.log("!!!Attention. trying to create new record from existing record");
        } else {
            var url = appConfig.DbUrl + appConfig.DbPath + table + '?apiKey=' + appConfig.DbId;
            return $http.post(url, record);
        }
    };
    DbActionsService.delete = function(table, id) {
        if (typeof (id) !== 'undefined') {
            var url = appConfig.DbUrl + appConfig.DbPath + table + "/" + id + "?apiKey=" + appConfig.DbId;
            return  $http.delete(url);
        }
    };

    DbActionsService.update = function(table, id, attrs) {
        if (typeof (id) !== 'undefined' && !attrs.hasOwnProperty('_id')) {
            var url = appConfig.DbUrl + appConfig.DbPath + table + "/" +
                    id + '?apiKey=' + appConfig.DbId;
            return  $http.put(url, attrs);
        } else {
            console.log("!!!Attention. Wrong parameters on update operation");
            console.log("ID: ", id);
            console.log("Attrs: ", attrs);
            return "error";
        }
    };
    DbActionsService.getAll = function(table) {
        var url = appConfig.DbUrl + appConfig.DbPath + table + "?apiKey=" + appConfig.DbId;
        return $http.get(url);
    };
    DbActionsService.getRecord1 = function(table, id) {
        var url = appConfig.DbUrl + appConfig.DbPath + table + "/" + id + "?apiKey=" + appConfig.DbId;
        return $http.get(url);
    };
    return DbActionsService;
});
//// end of WEEK GOAL SERVICE
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
    loginService.createUser = function(resource) {
        console.log("create user");
        console.log(resource);

        var userNew = function($resource) {
            var userNew1 = $resource('https://api.mongolab.com/api/1/databases/' +
                    '/better-you/collections/users/:id',
                    {apiKey: 'Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo'}, {
                id: '@_id.$oid'
            });
            return userNew1;
        };
        return userNew;
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

