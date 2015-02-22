angular.module('smartfuse.controllers')

.controller('ProfileCtrl', function($scope, $ionicModal, $timeout, UserAPI,$ionicLoading,$state,$ionicPopup,UserService) {

    //get the current user
    $scope.user = UserService.currentUser();

    //list the current country codes
    $scope.countryCodes = [
      "uk",
      "us"
    ];

    //sets the house size of a user, called from the form
    $scope.setHouseSize = function(size){
      console.log(size);
      $scope.user.houseSize = size;
    };

    //updates the profile of a user 
    $scope.updateUser = function(){

      console.log($scope.user);

      //update the cached instance...
      UserService.login($scope.user);

      //show loading...
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        showDelay: 0
      });

      //call the update method on the api service
      UserAPI.update($scope.user.id,$scope.user.name,$scope.user.email,$scope.user.countryCode,$scope.user.houseSize).then(function(data){
        
        //on return hide loading
        $ionicLoading.hide();

        //check if there is an error message
        if(!data.error){
          console.log(data);
          //close the login
          //$scope.closeLogin();
        }else{

          //show pop up if there is an error...
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