angular.module('smartfuse.controllers')

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
      if(data.applianceID == fuse.id && data.hubID == fuse.hubID){
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
});