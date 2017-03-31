describe('LoginCtrl', function() {
    beforeEach(module('starter.controllers'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('$scope.settings', function() {
        it('is true', function() {
            var $scope = {};
            var controller = $controller('LoginCtrl', { $scope: $scope });
            expect($scope.settings).toEqual(true);
        });
    });
});