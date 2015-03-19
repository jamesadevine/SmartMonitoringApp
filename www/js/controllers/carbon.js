angular.module('smartfuse.controllers')

.controller('CarbonCtrl', function($scope, $ionicModal, $timeout,FuseAPI, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,FuseService) {

  //tell the parent controller what the current tab is!
  $scope.tabReporter = function(){
    $scope.$emit('tabChanged', 0);
  };

});
