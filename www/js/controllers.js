angular.module('smartfuse.controllers', ['smartfuse.api'])

/*
  ---------LOGIN CONTROLLER---------
*/

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
})

/*
  ---------REGISTER CONTROLLER---------
*/

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
})

/*
  ---------LOGOUT CONTROLLER---------
*/

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
})

/*
  ---------PROFILE CONTROLLER---------
*/

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

          //close the login
          $scope.closeLogin();
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
})

/*
  ---------HOME CONTROLLER---------
*/

.controller('HomeCtrl', function($rootScope,$document,$scope, $ionicModal, $timeout,FuseAPI, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,CacheService,FuseService) {

    //get the current date...
    var currentDate = moment().format("DD-MM-YYYY");

    //get the dates for the past 15 days
    $scope.dates = dateGenerator(15);

    //set the defaul selected item date to todays date...
    $scope.selectedItem = $scope.dates[0];

    //call init when the page has been loaded...
    $scope.init = function(){
      $scope.loadSummary(currentDate);
    };

    //loads the summary for the current date...
    //if refresh is set, it will force a pull from the server.
    $scope.loadSummary = function(date,refresh){

      //if we have a cached version, and we aren't being forced to fetch from the server
      //we don't need to show loading.
      if(FuseService.getSummary(date)&&!refresh){
        showLoading =false;
      }else{
        showLoading=true;
      }

      //if showloading is set, display loading...
      if(showLoading){
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          showDelay: 0
        });
      }

      //otherwise retrieve the cached version
      if(!showLoading){
        var cached = FuseService.getSummary(date);
        $scope.labels=cached.labels;
        $scope.data = cached.energyData;
        $scope.priceData= cached.priceData;
      }else{

        //fetch a new version from the server...
        FuseAPI.summary(UserService.currentUser().id,date).then(function(data){

          //remove the sipinner if neccessary
          if(showLoading){
            $ionicLoading.hide();
          }

          //if there aren't any errors
          //set the chart data and cache...
          if(!data.error){
            $scope.labels=data.summary.labels;
            $scope.data = data.summary.energyData;
            $scope.priceData= data.summary.priceData;
            FuseService.storeSummary(date,data.summary);
          }else{
            //otherwise display error,
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

    //call the init function
    $scope.init();
})

/*
  ---------FUSES CONTROLLER---------
*/

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
      if(!data.error){
        //get the keys (hub names)
        $scope.fusesKeys = Object.keys(data.fuses);
        //check if the selectHub exists
        if(!$scope.selectedHub)
          $scope.selectedHub = $scope.fusesKeys[0];
        //set the fuse data
        $scope.fuses = data.fuses[$scope.selectedHub];
        //cache the fuse data
        FuseService.storeFuses(data.fuses);
      }else{
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
})

/*
  ---------LIVE CHART CONTROLLER---------
*/

.controller('LiveCtrl', function($scope,$interval, $ionicModal, $timeout, UserAPI,$ionicLoading,$state,$ionicPopup,UserService,SocketService) {
  
  //controls the live chart in the data modal

  var maximum =300;

  var fuse = null;

  //set the default chart options, data and labels
  $scope.labels=[];
  $scope.data = [[0]];
  $scope.options = { animation: false, showScale : true, showTooltips : false, pointDot: false, datasetStrokeWidth : 0.5, };

  var live = null;

  var fillSpace = 0;

  //listen for any data passed through using socket io.
  //sockets are specific, so only data relating to the current user will be pushed to the device...
  SocketService.on('dataAdded',function(data){

      //check that the data received matches the current fuse we are viewing.
      if(data.fuseID == fuse.id && data.hubID == fuse.hubID){
        //push the data onto the chart
        $scope.labels.push('');
        fillSpace=data.value;
        $scope.data[0].push(data.value);
      }
      $scope.$apply();
    });

  //listen for the modal opened event, triggering the start of the live data
  $scope.$on('modalOpened', function(event, receivedFuse) {

    fuse=receivedFuse;
    //add a repeat call every second
    //start slow for mobile devices
    live = $interval(function () {
      getLiveChartData(true);
    }, 1000);
  });
  
  function getLiveChartData (first) {

    //continually remove and add the fillSpace variable...
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
    //if this was the first call i.e. a slow start for mobile devices...
    //ramp up the speed to every 0.04 seconds
    if(first){
      $interval.cancel(live);
      live = $interval(function () {
        getLiveChartData(false);
      }, 40);
    }
  }

  //when the modalclosed event is broadcast... cancel the repeat call.
  $scope.$on('modalClosed', function(event, args) {
    $interval.cancel(live);
  });
})

/*
  ---------SEVEN DAY CONTROLLER---------
*/

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
})

/*
  ---------HUBS CONTROLLER---------
*/

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

//generates dates X number of days into the past
function dateGenerator(numberOfDays){
  var dateArray = [];
  for(var i=0;i<numberOfDays;i++)
    dateArray.push(moment().subtract(i,'days').format("DD-MM-YYYY"));
  console.log(dateArray);
  return dateArray;
}