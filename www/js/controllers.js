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
.controller('HomeCtrl', function($rootScope,$scope, $ionicModal, $timeout,FuseAPI, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,CacheService,FuseService) {
    //$state.go($state.current, {}, {reload: true});

   /* $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      console.log("TEST")
       if(toState.url == '/home'){
        $scope.init(); 
        //$state.go($state.current, {}, {reload: true});
        console.log("should be reloading?");
       }
        
    });
    /*
    $scope.labels=[];
    $scope.data = [[]];
    $scope.priceData= [[]];
    */
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

    $scope.init = function(){
      console.log("init");
      $scope.loadSummary(currentDate);
    };
    $scope.loadSummary = function(date,refresh){
      if(FuseService.getSummary(date)&&!refresh){
        showLoading =false;
      }else{
        showLoading=true;
      }
      if(showLoading){
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          showDelay: 0
        });
      }
      if(!showLoading){
        var cached = FuseService.getSummary(date);
        console.log("cached: ",cached.names);
        $scope.labels=cached.labels;
        $scope.data = cached.data;
        $scope.priceData= cached.priceData;
      }else{
        FuseAPI.summary(UserService.currentUser().id,date).then(function(data){
          console.log("DATA",JSON.stringify(data));
          
          var currentUser = UserService.currentUser();

          if(showLoading){
            $ionicLoading.hide();
          }

          if(!data.error){

            var monthlyPrice = currentUser.energy.price[currentUser.houseSize];
            var dailyPrice = monthlyPrice/30;
            var hourlyPrice = dailyPrice/24;

            var summaryData= data.fuses;

            var names = [];

            var datapoints = [];
            var datapoints2 = [];
            var tempobject = [];
            var tempobject2 = [];

            for(var i = 0;i<summaryData.length;i++){
              var currentSummary = summaryData[i];
              
              names.push(currentSummary.name);
              var total = 0;
              for(var j = 0;j<currentSummary.data.length;j++){
                total+=currentSummary.data[j].value;
              }

              tempobject.push(Number(total/currentSummary.data.length).toFixed(2));

              var kwatts = (Number(total/currentSummary.data.length) * 3)/1000;
              tempobject2.push((dailyPrice*kwatts).toFixed(2));
              $scope.lastUpdated=currentDate;
            }
            datapoints.push(tempobject);
            datapoints2.push(tempobject2);
            $scope.labels=names;
            $scope.data = datapoints;
            $scope.priceData= datapoints2;
            FuseService.storeSummary(date,{
              labels:names,
              data:datapoints,
              priceData:datapoints2
            });
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
      }
      
    };
    console.log("CONTROLLER INITING");
    $scope.init();
})
.controller('FusesCtrl', function($scope, $ionicModal, $timeout,FuseAPI, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,FuseService) {

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
    if ($event.stopPropagation) $event.stopPropagation();
    if ($event.preventDefault) $event.preventDefault();
    $event.cancelBubble = true;
    $event.returnValue = false;

    $ionicModal.fromTemplateUrl('templates/editfuse.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.selectedFuse = FuseService.getFuse(id);
      console.log($scope.selectedFuse);
      $scope.editFusePopover = popover;
      $scope.editFusePopover.show();
    });
    
  };
  $scope.closeEdit = function(){
    $scope.editFusePopover.hide();
    $scope.editFusePopover.remove();
  };
  $scope.openData = function(id,$event){
    console.log("opened");
    $ionicModal.fromTemplateUrl('templates/fusedata.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.selectedFuse = FuseService.getFuse(id);
      $scope.showFuseData = popover;
      console.log($scope.selectedFuse);
      $scope.showFuseData.show();
      $scope.$broadcast('modalOpened', id);
    });
    
  };
  $scope.closeData = function(){
    $scope.$broadcast('modalClosed', null);
    $scope.showFuseData.hide();
    $scope.showFuseData.remove();
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
})
.controller('LiveCtrl', function($scope,$interval, $ionicModal, $timeout, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,SocketService) {
  var maximum =300;

  var id = 0;

  $scope.labels=[];
  $scope.data = [[0]];
  $scope.options = { animation: false, showScale : true, showTooltips : false, pointDot: false, datasetStrokeWidth : 0.5, };

  var live = null;

  var fillSpace = 0;

  SocketService.on('dataAdded',function(data){
      console.log("DATARECEIVED ",data);
      if(data.fuseID == id){
        console.log("Updated");
        $scope.labels.push('');
        fillSpace=data.value;
        $scope.data[0].push(data.value);
      }
      $scope.$apply();
    });

  $scope.$on('modalOpened', function(event, args) {

    id=args;
    live = $interval(function () {
      getLiveChartData(true);
    }, 1000);
  });
  
  function getLiveChartData (first) {
    if ($scope.data[0].length) {
      $scope.labels = $scope.labels.slice(1);
      $scope.data[0] = $scope.data[0].slice(1);
    }

    while ($scope.data[0].length < maximum) {
      $scope.labels.push('');
      if(fillSpace>0)
        $scope.data[0].push(fillSpace);
      else
        $scope.data[0].push(0);
    }
    if(first){
      $interval.cancel(live);
      live = $interval(function () {
        getLiveChartData(false);
      }, 40);
    }
  }

  $scope.$on('modalClosed', function(event, args) {
    $interval.cancel(live);
  });
});