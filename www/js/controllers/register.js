angular.module('smartfuse.controllers')
  
.controller('RegisterCtrl', function($scope, $ionicModal, $timeout,UserService, UserAPI,$ionicLoading,$state,$ionicPopup) {

  // Form data for the register modal
  $scope.registerData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the register modal to close it
  $scope.closeRegister = function() {
    $scope.modal.hide();
  };

  // Open the register modal
  $scope.register = function() {
    $scope.modal.show();
  };

  // Perform the register action when the user submits the login form
  $scope.doRegister = function() {

    //show loading spinner
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      showDelay: 0
    });

    //call the registration api!
    UserAPI.register($scope.registerData.email,$scope.registerData.password,$scope.registerData.name).then(function(data){
      
      //hide on return...
      $ionicLoading.hide();

      //if there aren't any errors, login
      if(!data.error){
        UserService.login(data.user);
        $scope.closeRegister();
        $state.go('app.home');
      }else{

        //otherwise display the errors.
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
});