angular.module('smartfuse.controllers', ['smartfuse.api'])

.controller('LoginCtrl', function($scope, $ionicModal, $timeout,UserService, UserAPI,$ionicLoading,$state,$ionicPopup) {

  if(UserService.isLoggedIn())
    $state.transitionTo("app.home");

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
.controller('ProfileCtrl', function($scope, $ionicModal, $timeout, UserAPI,$ionicLoading,$state,$ionicPopup,UserService) {
    $scope.user = UserService.currentUser();
    $scope.countryCodes = [
      "uk",
      "us"
    ];
    $scope.setHouseSize = function(size){
      console.log(size);
      $scope.user.houseSize = size;
    };
    $scope.updateUser = function(){
      UserService.login($scope.user);
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        showDelay: 0
      });
      UserAPI.update($scope.user.id,$scope.user.name,$scope.user.email,$scope.user.countryCode,$scope.user.houseSize).then(function(data){
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
.controller('HomeCtrl', function($scope, $ionicModal, $timeout,FuseAPI, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,CacheService) {
    
    var summaryTitle= "Ave. Energy Consumption:";
    
    var currentDate = moment().format("DD-MM-YYYY");

    function dateGenerator(){
      var dateArray = [];
      for(var i=0;i<15;i++)
        dateArray.push(moment().subtract(i,'days').format("DD-MM-YYYY"));
      console.log(dateArray);
      return dateArray;
    }

    $scope.dates = dateGenerator();
    $scope.selectedItem = $scope.dates[0];

    $scope.chartType = "bar";

    $scope.config = {
      "labels": true,
      "title": summaryTitle,
      colors:["#296bc4","#4b4b4b","#dedede"],
      axisFormat:".02f",
      "lineLegend": "lineEnd"
    };
    $scope.init = function(){
      $scope.loadSummary(currentDate,true);
    };
    $scope.loadSummary = function(date,showLoading,notCached){
      $scope.config.title=summaryTitle+" "+date;
      if(showLoading){
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          showDelay: 0
        });
      }

      FuseAPI.summary(UserService.currentUser().id,date).then(function(data){
        console.log("DATA",JSON.stringify(data));
        
        if(showLoading){
          $ionicLoading.hide();
        }

        if(!data.error){

          var summaryData= data.fuses;

          var names = [];

          var datapoints = [];

          for(var i = 0;i<summaryData.length;i++){
            var currentSummary = summaryData[i];
            var tempobject = {};
            tempobject.x=currentSummary.name;
            tempobject.y=[];
            var total = 0;
            for(var j = 0;j<currentSummary.data.length;j++){
              total+=currentSummary.data[j].value;
            }

            tempobject.y.push(Number(total/currentSummary.data.length));
            datapoints.push(tempobject);
            datapoints.lastUpdated=currentDate;
          }
          console.log("actual ",datapoints);
          $scope.chartData ={
            series: ["Names"],
            data:datapoints
          };
          $scope.chartType = "bar";
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
    $scope.init();
})
.controller('FusesCtrl', function($scope, $ionicModal, $timeout,FuseAPI, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,FuseService) {
    

    $ionicModal.fromTemplateUrl('templates/editfuse.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.editFusePopover = popover;
    });
  

    $scope.init = function(){
      if(FuseService.isCached()){
        $scope.fuses = FuseService.fuses();
      }else{
        $scope.loadFuses(true);
      }
    };

    $scope.loadFuses = function(showLoading){
      console.log("loading fuses");
      console.log(FuseService.isCached());
      if(showLoading){
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          showDelay: 0
        });
      }

    FuseAPI.fuses(UserService.currentUser().id).then(function(data){
      console.log("DATA",JSON.stringify(data));
      if(showLoading){
        $ionicLoading.hide();
      }
      if(!data.error){
        data.fuses.lastUpdated=moment().format("DD-MM-YY");
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


  var uploadPicture = function(b64){
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      showDelay: 0
    });
    console.log(JSON.stringify(b64));

    FuseAPI.upload(UserService.currentUser().id,$scope.selectedFuse.id,b64).then(function(data){
        console.log("DATA",JSON.stringify(data));
        $ionicLoading.hide();
        if(!data.error){
          $scope.loadFuses();
          $scope.closeEdit();
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



  $scope.getPhoto = function(image){
    console.log(navigator);
    try{
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

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      showDelay: 0
    });
      
    FuseAPI.edit(UserService.currentUser().id,$scope.selectedFuse.id,$scope.selectedFuse.name,$scope.selectedFuse.description).then(function(data){
      console.log("DATA",data);
      if(!data.error){
        $scope.loadFuses();
        $scope.closeEdit();
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

  $scope.deleteFuse = function(id){
    $scope.selectedFuse = FuseService.getFuse(id);

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
      if(res) {
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          showDelay: 0
        });
        FuseAPI.remove(UserService.currentUser().id,$scope.selectedFuse.id).then(function(data){
          console.log("DATA",data);
          if(!data.error){
            $scope.loadFuses();
            $scope.closeEdit();
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