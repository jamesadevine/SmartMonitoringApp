angular.module('smartfuse.controllers')

.controller('CarbonCtrl', function($scope, $ionicModal, $timeout,FuseAPI, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,FuseService) {

  $scope.tabReporter = function(){
    $scope.$emit('tabChanged', 0);
  };

});
