angular.module('smartfuse.controllers')

.controller('PowerCtrl', function($scope, $ionicModal, $timeout,FuseAPI, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,FuseService) {
  
  $scope.title = 'My gauge';
  $scope.id = "gauge";
  $scope.value = 1000;
  $scope.options = {
    levelColors: ['#CE1B21', '#D0532A', '#FFC414', '#85A137'],
    //width:'80%',
    //height:'100%',
    relativeGaugeSize:true,
    //titleFontColor:
    //valueFontColor
  };
  $scope.min = 0;
  $scope.max = 1000;
});
