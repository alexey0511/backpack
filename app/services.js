app.factory('lsService', function lsService($rootScope) {
    return {
        saveGoals: function () {
            if (typeof (Storage) !== "undefined") {
                if ($rootScope.goals) {
                    var goals_saved = {};
                    goals_saved['goals'] = $rootScope.goals;
                    goals_saved['last_modified'] = new Date().getTime().toString();
                    localStorage.setItem('goals', JSON.stringify(goals_saved));
                } else {
                    console.log("rootScope empty");
                }
            } else {
                console.log("no local storage support");
            }
        },
        getGoals: function () {
            if (typeof (Storage) !== "undefined") {
                return JSON.parse(localStorage.getItem('goals'));
            } else {
                console.log("no local storage support");
            }
        }
    };
});
app.factory('goalsService', function goalsService($rootScope, $http, appConfig) {
    return {
        saveGoals: function () {
            if ($rootScope.goals) {
                var goals_saved = {};
                goals_saved = $rootScope.goals;
                goals_saved['last_modified'] = new Date().getTime().toString();
                goals_saved['_id'] = $rootScope.user.id;
                $http.post('https://api.mongolab.com/api/1/databases/better-you/collections/goals?apiKey='
                        + appConfig.DbId, goals_saved)
                        .success(function (data, status, headers, config) {
                            console.log("Successfully save to remote DB");
                        })
                        .error(function (data, status, headers, config) {
                            alert(status);
                        });

            } else {
                console.log("rootScope empty");
            }
        },
        getGoals: function () {
            var url = appConfig.DbUrl + appConfig.DbPath + "goals/" + $rootScope.user.id + "?apiKey=" + appConfig.DbId;
            return $http.get(url);
        },
        getScores: function() {
            var url = appConfig.DbUrl + appConfig.DbPath + "users?f={'name':1, 'score':1}&s={'score':-1}&apiKey=" + appConfig.DbId;
            return $http.get(url);
        },
        getNews: function() {
            var url = appConfig.DbUrl + appConfig.DbPath + "news?f={'title':1, 'details':1}&s={'date':1}&apiKey=" + appConfig.DbId;
            return $http.get(url);
        }
    };
});
app.factory('idService', function ($rootScope, $cookieStore) {
    var idService = {};
    idService.generate = function () {
        var last_id;
        var id;
        var start = 1000000;
        var id = 0;
        if ($cookieStore.get('last_id')) {
            last_id = $cookieStore.get('last_id');
        } else {
            $cookieStore.put('last_id', start);
            last_id = start;
        }
        if (last_id) {
            id = last_id + 1;
            $cookieStore.put('last_id', id);
        } else {
            id = start + 1;
        }
        ;
        return id;
    };
    return idService;
});
app.factory('FBServiceFAKE', function FBService($rootScope, $q) {
    var FBService = {};
    return {
        init: function () {
            var deferred = $q.defer();
            $rootScope.loadingstage = "Loading Facebook...";
            setTimeout(function () {
                console.log("1. FB init finished");
                deferred.resolve();
            }, 50);
            return deferred.promise;
        },
        getStatus: function () {
            var deferred = $q.defer();
            var status = 'connected';
            setTimeout(function () {
                deferred.resolve(status);
            }, 50);
            return deferred.promise;
        },
        login: function (callback) {
            console.log("Hello from FB LOGIN");
            FBService.getStatus();
        },
        loginCallback: function (response) {
            console.log("Hello from FB LOGIN CALLBACK");
        },
        onStatusChange: function (response) {
            console.log('onStatusChange', response);
            if (response.status != 'connected') {
                login(loginCallback);
            } else {
                getMe(function () {
                    getPermissions(function () {
                        if (hasPermission('user_friends')) {
                            getFriends(function () {
//                                renderWelcome();
                                //                              onLeaderboard();
                                //                            showHome();
                            });
                        } else {
                            //                      renderWelcome();
                            //                    showHome();
                        }
                    });
                });
            }
        },
        onAuthResponseChange: function (response) {
            console.log('onAuthResponseChange');
        },
// Personalisation

        getMe: function () {
            $rootScope.loadingstage = "Getting user Details...";
            console.log("3. Getting user details...");
            var deferred = $q.defer();
            setTimeout(function () {
                var response = {
                    "id": "928771773805240",
                    "email": "om.alex@hotmail.com",
                    "first_name": "Alexey",
                    "gender": "male",
                    "last_name": "Russia",
                    "link": "https://www.facebook.com/app_scoped_user_id/928771773805240/",
                    "locale": "en_GB",
                    "name": "Alexey Russia",
                    "timezone": "7",
                    "updated_time": "2014-10-26T08:18:20+0000",
                    "verified": "true"
                };
                $rootScope.user = response;
                deferred.resolve();
            }, 500);
            return deferred.promise;
        },
        renderWelcome: function () {
            var welcome = $('#welcome');
            welcome.find('.first_name').html($rootScope.user.first_name);
            welcome.find('.profile').attr('src', $rootScope.user.picture.data.url);
        },
        getFriends: function (callback) {
            var response = [{
                    "first_name": "max"
                }
            ];
            $rootScope.user.friends = response;
            callback();
        },
        getPermissions: function (callback) {
            var response = {};
            response.data = [];
            response.data = [
                {
                    "permision": "public_profile",
                    "status": "granted"
                },
                {
                    "permision": "email",
                    "status": "granted"
                },
                {
                    "permision": "user_friends",
                    "status": "granted"
                }

            ];
            $rootScope.user.permissions = response.data;
            console.log('User Permissions: ', $rootScope.user.permissions);
            callback();
        },
        hasPermission: function (permission) {
            console.log(permission);
            for (var i in $rootScope.user.permissions) {
                if (
                        $rootScope.user.permissions[i].permission == permission
                        && $rootScope.user.permissions[i].status == 'granted')
                    return true;
            }

            return false;
        },
        reRequest: function (scope, callback) {
            console.log("Permission rerequested");
        }
    };
});
app.factory('dateService', function () {
    var ds = {};
    ds.getWeeks = function () {
        var weeks = [];
        for (i = 1; i <= 52; i++) {
            weeks.push(i);
        }
        return weeks;
    };
    ds.getYears = function () {
        var years = [];
        for (i = 2014; i <= 2020; i++) {
            years.push(i);
        }
        return years;
    };
    ds.getWeek = function (date) {
        var week = 0;
        Date.prototype.getWeek = function () {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() - 1) / 7);
        };
        week = date.getWeek();
        return week;
    };
    ds.getMonths = function () {
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
// FACEBOOK
app.factory('FBService', function FBService($rootScope, appConfig, $window, AuthenticationService, $q) {
    var FBService = {};
    return {
        init: function (onAuthResponseChange, onStatusChange) {
            var deferred = $q.defer();
            console.log("FB INIT", appConfig.fbId);
            $window.fbAsyncInit = function () {
                // Executed when the SDK is loaded
                FB.init({
                    appId: appConfig.fbId,
                    channelUrl: 'app/channel.html',
                    status: true,
                    cookie: true,
                    frictionlessRequests: true,
                    version: 'v2.0',
                    xfbml: true
                });
                FB.Event.subscribe('auth.authResponseChange', onAuthResponseChange);
                FB.Event.subscribe('auth.statusChange', onStatusChange);
                deferred.resolve();
            };
            return deferred.promise;
        },
        getStatus: function () {
            var deferred = $q.defer();
            FB.getLoginStatus(function (response) {
//                return response.status;
                $rootScope.fbSession = response;
                $rootScope.$apply();
                deferred.resolve(response);
            });
            return deferred.promise;
        },
        login: function (callback) {
            FB.login(callback, {scope: 'public_profile, email, user_friends'});
        },
        loginCallback: function (response) {
            console.log('loginCallback', response);
            if (response.status != 'connected') {
                top.location.href = 'https://www.facebook.com/appcenter/' + appConfig.fbName;
            }
        },
        onStatusChange: function (response) {
            console.log('onStatusChange', response);
            if (response.status != 'connected') {
                login(loginCallback);
            } else {
                getMe(function (response) {
                    $rootScope.user = response;
                    //     $location.path('/home');
                    $location.path('/goals');
                });
            }
        },
        onAuthResponseChange: function (response) {
            console.log('onAuthResponseChange', response);
        },
// Personalisation

        getMe: function () {
            var deferred = $q.defer();
            console.log("4. Getting user details...");
            FB.api('/me', {fields: 'id,name,first_name,picture.width(50).height(50)'}, function (response) {
                if (!response.error) {
                    deferred.resolve(response);
                } else {
                    console.error('/me', response);
                    defered.reject(response);
                }
            });
            return deferred.promise;
        },
        renderWelcome: function () {
            var welcome = $('#welcome');
            welcome.find('.first_name').html($rootScope.user.first_name);
            welcome.find('.profile').attr('src', $rootScope.user.picture.data.url);
        },
        getFriends: function (callback) {
            FB.api('/me/friends', {fields: 'id,name,first_name,picture.width(120).height(120)'}, function (response) {
                if (!response.error) {
                    console.log("getFriends", response);
                    $rootScope.user.friends = response;
                    if (callback) {
                        callback(response);
                    }
                } else {
                    console.error('/me/friends', response);
                }
            });
        },
        getPermissions: function (callback) {
            FB.api('/me/permissions', function (response) {
                if (!response.error) {
                    $rootScope.user.permissions = response.data;
                    console.log('User Permissions: ', $rootScope.user.permissions);
                    callback();
                } else {
                    console.error('/me/permissions', response);
                }
            });
        },
        hasPermission: function (permission) {
            for (var i in $rootScope.user.permissions) {
                if (
                        $rootScope.user.permissions[i].permission == permission
                        && $rootScope.user.permissions[i].status == 'granted')
                    return true;
            }

            return false;
        },
        reRequest: function (scope, callback) {
            FB.login(callback, {scope: scope, auth_type: 'rerequest'});
        }
    };
});
// SESSION

app.factory('Session', function () {
    this.create = function (accessToken, expiresIn, signedRequest, userID, status) {
        this.id = accessToken;
        this.expiresIn = expiresIn;
        this.signedRequest = signedRequest;
        this.userID = userID;
        this.status = status;
    };
    this.destroy = function () {
        this.id = null;
        this.expiresIn = null;
        this.signedRequest = null;
        this.userID = null;
        this.status = null;
    };
    return this;
});
// USER SERVICE
app.factory('userService', function ($http, appConfig) {
    var userService = {};
    var userId = null;
    userService.getUser = function (userId) {
        var url = 'https://api.mongolab.com/api/1/databases/better-you/collections/users/' + userId +
                '?apiKey=' + appConfig.DbId;
        return $http.get(url);
    };
    userService.create = function (user) {
        ////
        var url = 'https://api.mongolab.com/api/1/databases/better-you/collections/users?apiKey=' + appConfig.DbId;
        return  $http.post(url, user);
    };
    userService.delete = function (id) {
        var appId;
        console.log("delete user");
        var url = "https://api.mongolab.com/api/1/databases/better-you/collections/" + id + "?apiKey=" + appConfig.DbId;
        $http.delete(url);
    };
    userService.update = function (id, attrs) {
        $http.put('https://api.mongolab.com/api/1/databases/better-you/collections/users' +
                id + '?apiKey=' + appConfig.DbId,
                attrs).success(function (data, status, headers, config) {
        }).error(function (data, status, headers, config) {
            alert(status);
        });
    };
    return userService;
}); // end of user service


// Database Actions SERVICE
app.factory('DbActionsService', function ($http, appConfig) {
    var DbActionsService = {};
    DbActionsService.getRecord = function (table, query) {
        var url = appConfig.DbUrl + appConfig.DbPath + table +
                '?q=' + query + '&apiKey=' + appConfig.DbId;
        return $http.get(url);
    };
    DbActionsService.create = function (table, record) {
        if (record.hasOwnProperty("_id")) {
            console.log("!!!Attention. trying to create new record from existing record");
        } else {
            var url = appConfig.DbUrl + appConfig.DbPath + table + '?apiKey=' + appConfig.DbId;
            return $http.post(url, record);
        }
    };
    DbActionsService.delete = function (table, id) {
        if (typeof (id) !== 'undefined') {
            var url = appConfig.DbUrl + appConfig.DbPath + table + "/" + id + "?apiKey=" + appConfig.DbId;
            return  $http.delete(url);
        }
    };
    DbActionsService.update = function (table, id, attrs) {
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
    DbActionsService.getAll = function (table) {
        var url = appConfig.DbUrl + appConfig.DbPath + table + "?apiKey=" + appConfig.DbId;
        return $http.get(url);
    };
    DbActionsService.getRecord1 = function (table, id) {
        var url = appConfig.DbUrl + appConfig.DbPath + table + "/" + id + "?apiKey=" + appConfig.DbId;
        return $http.get(url);
    };
    return DbActionsService;
});
//// end of WEEK GOAL SERVICE
// LOGIN
app.factory('LoginService', function ($http, Session) {
    var loginService = {};
    loginService.getUser = function (username) {
        if (username !== 'undefined') {
            var url = 'https://api.mongolab.com/api/1/databases/better-you/collections/users?q={"username": "' + username +
                    '"}&apiKey=Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo';
            return $http.get(url);
        }
    };
    loginService.createUser = function (resource) {

        var userNew = function ($resource) {
            var userNew1 = $resource('https://api.mongolab.com/api/1/databases/' +
                    '/better-you/collections/users/:id',
                    {apiKey: 'Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo'}, {
                id: '@_id.$oid'
            });
            return userNew1;
        };
        return userNew;
    };
    loginService.login = function (user) {
        var url = 'https://api.mongolab.com/api/1/databases/better-you/collections/users?q={"username": "' + user.username +
                '"}&apiKey=Enp-LXbc1lFrpXjd6CqVHGJ2AmhODPgo';
        return $http.get(url);
    };
    loginService.isAuthenticated = function () {
        if (Session.userId) {
//    console.log(Session);
        } else {
//    console.log("not signed");
        }
        return !!Session.userId;
    };
    loginService.isAuthorized = function (authorizedRoles) {
//        if (!app.isArray(authorizedRoles)) {
//            authorizedRoles = [authorizedRoles];
//        }
//        return (authService.isAuthenticated() &&
//                authorizedRoles.indexOf(Session.userRole) !== -1);
    };
    return loginService;
});
app.factory("AuthenticationService", function ($rootScope, Session, AuthorizationService) {
    var sAuth = {};
    sAuth.watchLoginChange = function () {
        var _self = this;
        FB.Event.subscribe('auth.authResponseChange', function (response) {
            if (response.status === 'connected') {
                //     _self.getUserInfo();
                Session = response;
                $rootScope.user.at = response.accessToken;
            }
            else {
                Session.destroy(); // to be implemented
                $rootScope.user = {};
            }
        });
        return null;
    };
    sAuth.getUserInfo = function () {
//        console.log("GET USER INFO");
//            FB.api('/me/permissions', {
//}, function(response) {
//  console.log("/me",response);
//});

        var _self = this;
        FB.api('/me', function (response) {
            $rootScope.$apply(function () {
                //   $rootScope.user = _self.user = response;
                AuthorizationService.login($rootScope.user);
                //             AuthorizationService.requestUser();
            });
        });
    };
    sAuth.logout = function () {
        var _self = this;
        FB.logout(function (response) {
            $rootScope.$apply(function () {
                $rootScope.user = _self.user = {};
                Session.destroy();
            });
        });
    };
    return sAuth;
});
app.factory("AuthorizationService", function Authentication($q, $http, $cookieStore, $timeout, userService, $rootScope, AUTH_EVENTS, Session, $cookieStore, appConfig) {
    var Authentication = {};
    return  {
        requestUser: function ()
        {
            console.log("request user");
            var deferred = $q.defer();
            if (Object.getOwnPropertyNames($rootScope.user).length !== 0) {
                deferred.resolve();
            } else {
                if ($cookieStore.get('current_user')) {
                    $rootScope.user = $cookieStore.get('current_user');
                    Authentication = true;
                    deferred.resolve();
                } else {
                    // User needs to login
                    $rootScope.user = {};
                    $rootScope.user =
                            {"id": "999",
                                "name": "guest",
                                "role": "guest"};
//                    FB.getLoginStatus(function (response) {
                    //                      if (response.status === 'connected') {
                    //                        this.login($rootScope.user);
                    //                  } else {
                    $rootScope.message = "Please login";
                    //                }
                    //          });
                    deferred.resolve('true');
                }
            }
            return deferred.promise;
        },
        getUser: function ()
        {
            return $rootScope.user;
        },
        exists: function ()
        {
            if (Object.getOwnPropertyNames($rootScope.user).length === 0 ||
                    //  !$rootScope.user.hasOwnProperty("role") ||
                    $rootScope.user.role === "guest") {
                return false;
            } else {
                return true;
            }
        },
        login: function () {
            userService.getUser($rootScope.user.id)
                    .success(function (user) {
                        $rootScope.user = user;
                        $cookieStore.put('current_user', $rootScope.user);
                        document.getElementById('status-message').className = "alert alert-success";
                    })
                    .error(function (data) {
                        if (data.message === "Document not found") {
                            $rootScope.user.role = "user";
                            $rootScope.user.score = "1001";
                            $rootScope.user._id = $rootScope.user.id;
                            $rootScope.user.nickname = $rootScope.user.name;
                            userService.create($rootScope.user);
                            document.getElementById('status-message').className = "alert alert-success";
                        } else {
                            $rootScope.error = "Error with login your in. Please contact administrator";
                        }
                    });
            $rootScope.message = "";
        },
        logout: function ()
        {
            $rootScope.user = null;
        },
        isAdmin: function ()
        {
            if ($rootScope.user.hasOwnProperty("role")) {
                return this.exists() && $rootScope.user.role === 'admin';
            } else {
                return false;
            }
        }
    };
});
app.factory('Application', function Application() {
    var ready = false, registeredListeners = [];
    var callListeners = function () {
        for (var i = registeredListeners.length - 1; i >= 0; i--) {
            registeredListeners[i]();
        }
        ;
    }
    return {
        isReady: function () {
            return ready;
        },
        makeReady: function () {
            ready = true;
            callListeners();
        },
        registerListener: function (callback)
        {
            if (ready)
                callback();
            else
                registeredListeners.push(callback);
        }
    };
});
app.factory('RouteFilter', function RouteFilter($location) {
    var filters = [];
    var getfilter = function (route)
    {
        for (var i = filters.length - 1; i >= 0; i--) {
            for (var j = filters[i].routes.length - 1; j >= 0; j--) {
                if (matchRoute(filters[i].routes[j], route))
                {
                    return filters[i];
                }
            }
            ;
        }
        ;
    };
    var matchRoute = function (filterRoute, route) {
        if (route instanceof RegExp) {
            return route.test(filterRoute);
        } else {
            return route === filterRoute;
        }
        ;
    };
    return {
        canAccess: function (route) {
            var filter = getfilter(route);
            return filter.callback();
        },
        register: function (name, routes, callback, redirectUrl)
        {
            redirectUrl = typeof redirectUrl !== 'undefined' ? redirectUrl : null;
            filters.push({
                name: name,
                routes: routes,
                callback: callback,
                redirectUrl: redirectUrl
            });
        },
        run: function (route) {
            var filter = getfilter(route);
            if (filter != null && filter.redirectUrl != null)
                if (!filter.callback())
                {
                    $location.path(filter.redirectUrl);
                }
        }
    };
});