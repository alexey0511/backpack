app.run(function (RouteFilter, AuthorizationService) {

    // Test pages to be deleted
    RouteFilter.register('guest', ['/test1'], function () {
        return !AuthorizationService.exists();
    }, '/home');
    RouteFilter.register('user', ['/test2'], function () {
        return AuthorizationService.exists();
    }, '/');
    RouteFilter.register('admin', ['/test3'], function () {
        return AuthorizationService.isAdmin();
    }, '/');
    // Pages Available for unauthoried user
    RouteFilter.register('guest', ['/login'], function () {
        return AuthorizationService.exists();
    }, '/');
    RouteFilter.register('user', ['/home'], function () {
        return AuthorizationService.exists();
    }, '/');
    RouteFilter.register('user', ['/goals'], function () {
        return AuthorizationService.exists();
    }, '/');
    RouteFilter.register('admin', ['/habits'], function () {
        return AuthorizationService.isAdmin();
    }, '/');
    RouteFilter.register('profile/user', ['/profile'], function () {
        return AuthorizationService.exists();
    }, '/');
    RouteFilter.register('feedback/user', ['/feedback'], function () {
        return AuthorizationService.exists();
    }, '/');
    RouteFilter.register('tc/user', ['/tc'], function () {
        return AuthorizationService.exists();
    }, '/');
    RouteFilter.register('profile/user', ['/login'], function () {
        return !AuthorizationService.exists();
    }, '/');

});

