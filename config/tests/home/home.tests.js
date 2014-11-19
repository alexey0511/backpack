describe("First test", function() {
    it("to work correctly", function() {
        var a = 12;
        var b = a;
        
        expect(a).toBe(b);
        expect(a).not.toBe(null);
    });
});

describe("Second test", function() {
    it("to work correctly", function() {
        var a = 14;
        var b = a;
        
        expect(a).toBe(b);
        expect(a).not.toBe(null);
    });
});
describe("Test 3", function () {
    beforeEach(angular.module("better-you"));

//    describe("myController", function () {
//        var scope,
//            controller;
//
//        beforeEach(inject(function ($rootScope, $controller) {
//            scope = $rootScope.$new();
//            controller = $controller;
//        }));

//        it("should assign message to hello world", function () {
//            controller("SimpleCtrl", {$scope: scope});
//            expect(scope.message).toBe("Hello World");
//        });
//    });
});

describe('Unit test 4', function() {
  // Load the module with MainController
  beforeEach(module('better-you'));

  var ctrl, scope;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('myController', {
      $scope: scope
    });
  }));

  it('should create $scope.greeting when calling sayHello', 
    function() {
        expect(scope).not.toBe(null);
  });
});
