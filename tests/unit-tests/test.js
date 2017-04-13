describe('TestCtrl', function() {
    beforeEach(module('starter.controllers'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('$scope.myTruth', function() {
        it('should be true', function() {
            var $scope = {};
            var controller = $controller('TestCtrl', { $scope: $scope });
            expect($scope.myTruth).toEqual(true);
        });
    });
});