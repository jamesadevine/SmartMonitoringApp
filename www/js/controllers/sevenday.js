angular.module('smartfuse.controllers')

.controller('SevenDayCtrl', function($scope,$interval, $ionicModal, $timeout, UserAPI,FuseAPI,$ionicLoading,$state,$ionicPopup,UserService,FuseService) {
  
  //controls the 7 day history graph

  var currentDate = moment();

  //wait for the modal opened event
  $scope.$on('modalOpened', function(event, fuse) {
    //show summary
    $scope.getSummary(fuse);
  });

  //fetch the summary from the server
  $scope.getSummary = function(fuse){
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      showDelay: 0
    });
      
    FuseAPI.sevenDaySummary(UserService.currentUser().id,fuse.id,fuse.hubID).then(function(data){
      console.log("DATA",data);
      if(!data.error){
        
        $scope.labels=data.summary.labels;
        $scope.data=data.summary.energyData;
      }else{
        $ionicPopup.alert({
          title: 'Error',
          template: data.error,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button-assertive',
            }
          ]
         });
      }
      $ionicLoading.hide();
    });
  };
});