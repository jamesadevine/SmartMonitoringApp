angular.module('smartfuse.controllers')

.controller('FusesCtrl', function($scope, $ionicModal, $timeout,FuseAPI, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,FuseService) {

  //check if data is cached
  //if it's cached... display
  //otherwise get fresh data...
  $scope.init = function(){
    if(FuseService.isCached()){
      var temp = FuseService.fuses();
      $scope.lastUpdated=temp.lastUpdated;
      delete temp.lastUpdated;
      $scope.fusesKeys = Object.keys(temp);
      $scope.selectedHub = String($scope.fusesKeys[0]);
      $scope.fuses = temp[$scope.selectedHub];
    }else{
      $scope.loadFuses(true);
    }
  };

  //controls the swapping of data when the hub option select is changed
  $scope.swapHub =function(selectedHub){
    $scope.selectedHub=selectedHub;
    var temp = FuseService.fuses();
    $scope.lastUpdated=temp.lastUpdated;
    delete temp.lastUpdated;
    $scope.fusesKeys = Object.keys(temp);
    $scope.fuses = temp[String($scope.selectedHub)];
  };

  $scope.loadFuses = function(showLoading){

  //if showloading is set, show the loading spinner.
  if(showLoading){
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      showDelay: 0
    });
  }

  //retrieve the fuses from the server.
  FuseAPI.fuses(UserService.currentUser().id).then(function(data){
    
    //if loading is displayed.. hide it
    if(showLoading){
      $ionicLoading.hide();
    }

    //check for errors
    if(!data.error && Object.getOwnPropertyNames(data.appliances).length > 0){
      //get the keys (hub names)
      $scope.fusesKeys = Object.keys(data.appliances);
      //check if the selectHub exists
      if(!$scope.selectedHub)
        $scope.selectedHub = $scope.fusesKeys[0];
      //set the fuse data
      $scope.fuses = data.appliances[$scope.selectedHub];
      //cache the fuse data
      FuseService.storeFuses(data.appliances);
    }else if(data.error){
      //show an alert if there is an error
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
    }else{
      $scope.fuses =[];
    }
  }).finally(function() {
    // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  });
};

//uploads a picture sent from the getPhoto
var uploadPicture = function(b64){

  //show loading
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    showDelay: 0
  });

  //upload the base64 string to the server...
  FuseAPI.upload(UserService.currentUser().id,$scope.selectedFuse.id,$scope.selectedFuse.hubID,b64).then(function(data){
      
      //hide loading
      $ionicLoading.hide();
      if(!data.error){
        //reload the fuses
        $scope.loadFuses();
        //close the modal
        $scope.closeModal();
      }else{
        //popup if error
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
  });
};

//gets a photo from the users' device
$scope.getPhoto = function(image){
  
  //wrap in a try catch... the browser version doesn't support navigator
  try{

    //get the picture... call upload picture if retrieved,
    //otherwise show an error message
    navigator.camera.getPicture(uploadPicture, function(err) {
          $ionicPopup.alert({
            templateitle: 'Error',
            template: err,
            buttons: [
              {
                text: '<b>Ok</b>',
                type: 'button-assertive',
              }
            ]
           });
        },
        {
          quality: 30,
          destinationType: 0,
          sourceType: Camera.PictureSourceType.CAMERA,
          encodingType: Camera.EncodingType.PNG,
          correctOrientation:true,
          allowEdit:true
        });
  }catch(err){
    //if the device doesn't support this, then show a popup.
    $ionicPopup.alert({
      title: 'Error',
      template: "Your platform doesn't support this feature.",
      buttons: [
        {
          text: '<b>Ok</b>',
          type: 'button-assertive',
        }
      ]
    });
  }
};

//open the fuse edit modal
$scope.openEdit = function(id,hubid,$event){

  //prevent event bubbling as there is a parent event that can occur
  if ($event.stopPropagation) $event.stopPropagation();
  if ($event.preventDefault) $event.preventDefault();
  $event.cancelBubble = true;
  $event.returnValue = false;

  //display modal
  $ionicModal.fromTemplateUrl('templates/editfuse.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.selectedFuse = FuseService.getFuse(id,hubid);
    $scope.currentModal = popover;
    $scope.currentModal.show();
  });
  
};


//open the data view for the selected fuse...
$scope.openData = function(id,hubid,$event){
  $ionicModal.fromTemplateUrl('templates/fusedata.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.selectedFuse = FuseService.getFuse(id,hubid);
    $scope.currentModal = popover;
    $scope.currentModal.show();
    //broadcast a modal opened event for the two controllers that are spawned in this modal
    $scope.$broadcast('modalOpened', $scope.selectedFuse);
  });
};

//close the currently focused modal.
$scope.closeModal = function(){
  //broadcast the event for the two controllers that are spawned in the data modal
  $scope.$broadcast('modalClosed', null);
  $scope.currentModal.hide();
  $scope.currentModal.remove();
};

//updates a fuse on the server
$scope.updateFuse = function(){

  //show the loading spinner
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    showDelay: 0
  });
    
  //put the variables to the server to update the server object.
  FuseAPI.edit(UserService.currentUser().id,$scope.selectedFuse.id,$scope.selectedFuse.hubID,$scope.selectedFuse.name,$scope.selectedFuse.description).then(function(data){
    
    //check for errors
    if(!data.error){
      //if there aren't reload the fuses and close
      $scope.loadFuses();
      $scope.closeModal();
    }else{
      //otherwise display an alert.
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
    //hide the loading spinner
    $ionicLoading.hide();
  });
};

//deletes a fuse held on the server
$scope.deleteFuse = function(id,hubid){

  //set the selected fuse
  $scope.selectedFuse = FuseService.getFuse(id,hubid);

  //ask the user if they want to do this
  var confirm = $ionicPopup.confirm({
    title: $scope.selectedFuse.name,
    template: 'Are you sure you want to delete this fuse?',
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
    //if there's a positive response, delete the fuse! :(
    if(res) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        showDelay: 0
      });
      FuseAPI.remove(UserService.currentUser().id,$scope.selectedFuse.id,$scope.selectedFuse.hubID).then(function(data){
        console.log("DATA",data);
        if(!data.error){
          $scope.loadFuses();
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

//call when page is loaded...
$scope.init();
});
