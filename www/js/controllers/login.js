angular.module('smartfuse.controllers')

.controller('LoginCtrl', function($scope, $ionicModal, $timeout,UserService, UserAPI,$ionicLoading,$state,$ionicPopup) {

  //check if the user is logged in...
  if(UserService.isLoggedIn())
    $state.transitionTo("app.home"); //transition them to app.home

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

    //call the login api.
    UserAPI.login($scope.loginData.email,$scope.loginData.password).then(function(data){
      
      //once returned hide the loading spinner...
      $ionicLoading.hide();

      //check if there are no errors
      if(!data.error){

        //set the local storage to the returned user object
        UserService.login(data.user);

        //close the login and go to home
        $scope.closeLogin();
        $state.go('app.home');

      }else{
        //if there is an error... let the user know!
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
