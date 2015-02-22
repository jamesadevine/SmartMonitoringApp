angular.module('smartfuse.controllers')

.controller('StatsCtrl', function($scope, $ionicTabsDelegate, $ionicModal, $timeout, EnergyAPI,$ionicLoading,$state,$ionicPopup,EnergyService) {

  $scope.currentgenerationoptions = {
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span> <%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
  };

  $scope.currentgenerationlabels = null;
  $scope.currentgenerationdata = null;

  //get the current date...
  var currentDate = moment().format("DD-MM-YYYY");

  //get the dates for the past 15 days
  $scope.dates = dateGenerator(15);

  $scope.selectedItem = $scope.dates[0];

  //call init when the page has been loaded...
  $scope.init = function(){
    $scope.loadSummary(currentDate);
  };

  $scope.currentCarbon = [];

  //loads the summary for the current date...
  //if refresh is set, it will force a pull from the server.
  $scope.loadSummary = function(date,refresh){

    //if we have a cached version, and we aren't being forced to fetch from the server
    //we don't need to show loading.
    if(EnergyService.getSummary(date)&&!refresh){
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
      var cached = EnergyService.getSummary(date);
      if(date == currentDate){
        $scope.currentCarbon = cached.currentCarbon;
        $scope.currentGeneration = cached.currentGeneration;
        $scope.currentPrice = cached.currentPrice;
      }

      $scope.historicCarbon = cached.historicCarbon;
      $scope.historicGeneration = cached.historicGeneration;
      $scope.historicPrice = cached.historicPrice;
      $scope.generateChartData(date);
      console.log(cached);
    }else{

      //fetch a new version from the server...
      EnergyAPI.stats(date).then(function(data){

        //remove the sipinner if neccessary
        if(showLoading){
          $ionicLoading.hide();
        }

        //if there aren't any errors
        //set the chart data and cache...
        if(!data.error){
          console.log(data);
          EnergyService.storeSummary(date,data.stats);

          data= data.stats;

          if(date == currentDate){
            $scope.currentCarbon = data.currentCarbon;
            $scope.currentGeneration = data.currentGeneration;

            $scope.currentPrice = data.currentPrice;
          }

          $scope.historicCarbon = data.historicCarbon;
          $scope.historicGeneration = data.historicGeneration;
          $scope.historicPrice = data.historicPrice;
          $scope.generateChartData(date);
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

  $scope.generateChartData = function(date){
    console.log('DATES ',currentDate,date);
    $scope.carbonhistoriclabels = [];
    $scope.carbonhistoricdata=[[]];
    $scope.carbonhistoricseries = ['Carbon Levels Over the Past 11 Hours ('+$scope.currentCarbon.unit+')'];

    var current = null;

    for(var i = 0; i < $scope.historicCarbon.data.length;i++){
      current = $scope.historicCarbon.data[i];
      
      if(i === 0 && date == currentDate)
        $scope.carbonhistoriclabels.push(current.time+' (now)');
      else
        $scope.carbonhistoriclabels.push(current.time);
      $scope.carbonhistoricdata[0].push(current.value);
    }

    $scope.pricehistoriclabels = [];
    $scope.pricehistoricdata=[];
    $scope.pricehistoricseries = [];

    console.log('TEST ',Object.keys($scope.historicPrice).length-1);

    
    //historic PRICESSS!!!

    var limit = 3;

    for(i = 0; i < Object.keys($scope.historicPrice).length;i++){
      current = $scope.historicPrice[i];
      if(i===0){
        for(var emptyCount =0; emptyCount<limit;emptyCount++)
          $scope.pricehistoricdata.push([]);
        console.log('SHOULD BE 11',$scope.pricehistoricdata);
      }

      //format time
      $scope.pricehistoriclabels.push((i<10)?'0'+String(i):String(i));

      for(var inner =0; inner < current.length; inner++){
        if(inner>=limit)
          break;
        //we need the dates for the series... TODO: We may need to have a limit as the graph looks confusing!
        if(i===0){
          $scope.pricehistoricseries.push(current[inner].date);
        }
        $scope.pricehistoricdata[inner].push(current[inner].value);
      }
    }
    console.log($scope.pricehistoricdata,$scope.pricehistoricseries,$scope.pricehistoriclabels);
    

    //CURRENT GENERATION
    $scope.currentgenerationlabels = [];
    $scope.currentgenerationdata = [];
    $scope.currentgenerationdatacolors = [];

    for(i =0; i <$scope.currentGeneration.data.length;i++){
      current = $scope.currentGeneration.data[i];
      $scope.currentgenerationlabels.push(current.normalText); //+' <i class="icon-power"></i>'
      $scope.currentgenerationdatacolors.push(current.color);
      $scope.currentgenerationdata.push(Number(current.percent));
    }

    //CURRENT HISTORIC
    $scope.historicgenerationlabels = [];
    $scope.historicgenerationdata = [];
    $scope.historicgenerationdatacolors = [];

    for(i =0; i <$scope.historicGeneration.data.length;i++){
      current = $scope.historicGeneration.data[i];
      $scope.historicgenerationlabels.push(current.normalText); //+' <i class="icon-power"></i>'
      $scope.historicgenerationdatacolors.push(current.color);
      $scope.historicgenerationdata.push(Number(current.percent));
    }
    console.log($scope.currentgenerationlabels,$scope.currentgenerationdata,$scope.currentgenerationdatacolors);


  };

  $scope.tabReporter = function(){
    $scope.currentTab = $ionicTabsDelegate.selectedIndex();
    console.log($scope.currentTab);
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
