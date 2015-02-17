angular.module('smartfuse.controllers')

.controller('HubsCtrl', function($scope, $ionicModal, $timeout,HubAPI, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,HubService) {

  //initialise the hub list
  $scope.init = function(){
    //get the cached version if it exists
    if(HubService.isCached()){
      $scope.hubs = HubService.hubs();
    }else{
      //otherwise get a fresh version
      $scope.loadHubs(true);
    }
  };

  //loads hub data
  $scope.loadHubs = function(showLoading){

    //show the loading spinner
    if(showLoading){
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        showDelay: 0
      });
    }

    //get the hub data
    HubAPI.hubs(UserService.currentUser().id).then(function(data){
      console.log("DATA",JSON.stringify(data));
      if(showLoading){
        $ionicLoading.hide();
      }
      if(!data.error){
        data.hubs.lastUpdated=moment().format("DD-MM-YY");
        $scope.hubs = data.hubs;
        HubService.storeHubs(data.hubs);
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
    }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  //open edit modal for a particular hup
  $scope.openEdit = function(id,$event){

    $ionicModal.fromTemplateUrl('templates/edithub.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.selectedHub = HubService.getHub(id);
      $scope.currentModal = popover;
      $scope.currentModal.show();
    });
    
  };

  //open add a new fuse modal
  $scope.openAdd = function(id,$event){

    $ionicModal.fromTemplateUrl('templates/addhub.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.currentModal = popover;
      $scope.currentModal.show();
    });
    
  };

  //close the currentmodal
  $scope.closeModal = function(){
    $scope.currentModal.hide();
    $scope.currentModal.remove();
  };

  //holds the new hub data used in add modal
  $scope.newHub ={};

  //submits the new hub id to the server to link the user account with the hub.
  $scope.addHub = function(){
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      showDelay: 0
    });
      
    //call the hub link api
    HubAPI.link($scope.newHub.id,UserService.currentUser().id).then(function(data){
      console.log("DATA",data);
      if(!data.error){
        $scope.loadHubs();
        $scope.closeModal();
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

  //updates only the name of the hub stored on the server...
  $scope.updateHub = function(){

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      showDelay: 0
    });
      
    HubAPI.edit($scope.selectedHub.id,UserService.currentUser().id,$scope.selectedHub.name).then(function(data){
      console.log("DATA",data);
      if(!data.error){
        $scope.loadHubs();
        $scope.closeModal();
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

  //removes a hub that is stored on the server
  $scope.deleteHub = function(id){
    $scope.selectedHub = HubService.getHub(id);

    //ask the user to confirm the removal
    var confirm = $ionicPopup.confirm({
      title: $scope.selectedHub.name,
      template: 'Are you sure you want to delete this Hub?',
      buttons:[
        {
          text: '<b>Cancel</b>'
        },
        {
          text: '<b>Yes</b>',
          type: 'button-assertive',
          onTap: function(e) {
            // Returning a value will cause the promise to resolve with the given value.
            return "OK";
          }
        }]
    });
    confirm.then(function(res) {
      //remove the hub...
      if(res) {
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          showDelay: 0
        });
        HubAPI.remove($scope.selectedHub.id,UserService.currentUser().id).then(function(data){
          console.log("DATA",data);
          if(!data.error){
            $scope.loadHubs();
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
      }
    });
  };

  $scope.init();
});