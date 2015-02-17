angular.module('smartfuse.controllers')

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
});

//generates dates X number of days into the past
function dateGenerator(numberOfDays){
  var dateArray = [];
  for(var i=0;i<numberOfDays;i++)
    dateArray.push(moment().subtract(i,'days').format("DD-MM-YYYY"));
  console.log(dateArray);
  return dateArray;
}