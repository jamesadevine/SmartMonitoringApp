angular.module('smartfuse.controllers', ['smartfuse.api'])

.controller('LoginCtrl', function($scope, $ionicModal, $timeout, UserAPI,$ionicLoading,$state,$ionicPopup) {

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      showDelay: 0
    });
    UserAPI.login($scope.loginData.email,$scope.loginData.password).then(function(data){
      console.log("DATA",data);
      $ionicLoading.hide();
      if(!data.error){
        $scope.closeLogin();
        $state.go('app.home');
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
    });
  };
})

.controller('LogoutCtrl', function($scope, $ionicModal, $timeout, UserAPI,$ionicLoading,$state,$ionicPopup,UserService) {


  // Perform the login action when the user submits the login form
  $scope.logout = function() {
    var confirm = $ionicPopup.confirm({
      title: 'Logout?',
      template: 'Are you sure you want to logout?',
      buttons:[
        {
          text: '<b>Cancel</b>'
        },
        {
          text: '<b>Ok</b>',
          type: 'button-assertive',
          onTap: function(e) {
            // Returning a value will cause the promise to resolve with the given value.
            return "OK";
          }
        }]
    });
    confirm.then(function(res) {
      if(res) {
        UserService.logout();
        $state.go('login');
      }
    });
    
  };
})

.controller('FusesCtrl', function($scope, $ionicModal, $timeout,FuseAPI, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,FuseService) {
    
    $scope.editData = {};

    $ionicModal.fromTemplateUrl('templates/editfuse.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.editFusePopover = popover;
      console.log("POPOVER ",$scope.editFusePopover);
    });
  

    $scope.loadFuses = function(){
      console.log("loading fuses");
      console.log(FuseService.isCached());
      if(!FuseService.isCached()){
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          showDelay: 0
        });
      }

      FuseAPI.fuses(UserService.currentUser().id).then(function(data){
        console.log("DATA",data);
        if(!FuseService.isCached()){
          $ionicLoading.hide();
        }
        if(!data.error){
          $scope.fuses = data.fuses;
          FuseService.storeFuses(data.fuses);
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


  $scope.uploadPicture = function(uri){
    console.log(uri);
  };

  $scope.getPhoto = function(image){
    console.log(navigator);
    navigator.camera.getPicture(function(imageURI) {

      // imageURI is the URL of the image that we can use for
      // an <img> element or backgroundImage.

    }, function(err) {

      // Ruh-roh, something bad happened
      
    },
        {
        quality: 50,
        destinationType: 0,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.PNG
        });
  };
  
  $scope.openEdit = function(id,$event){
    $scope.selectedFuse = FuseService.getFuse(id);
    console.log($scope.selectedFuse);
    $scope.editFusePopover.show();
  };
  $scope.closeEdit = function(){
    $scope.editFusePopover.hide();
  };
  $scope.updateFuse = function(){
    console.log($scope.selectedFuse);
  };
  $scope.loadFuses();
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
