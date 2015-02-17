angular.module('smartfuse.controllers')

.controller('LogoutCtrl', function($scope, $ionicModal, $timeout, UserAPI,$ionicLoading,$state,$ionicPopup,UserService) {

  // Perform the logout action when the user taps the logout button
  $scope.logout = function() {

    //confirm the action
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

      //check if there was a positive response...
      if(res) {

        //logout and transition to the login screen...
        UserService.logout();
        $state.go('login');
      }
    });
    
  };
});