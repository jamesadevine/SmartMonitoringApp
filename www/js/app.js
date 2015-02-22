// Ionic Smart fuse app App
// 'smartfuse.controllers' is found in controllers.js
// 'smartfuse.api' is found in api.js
// 'smartfuse.services' is found in services.js
angular.module('smartfuse', ['ionic','btford.socket-io','ngJustGage','chart.js', 'smartfuse.controllers','smartfuse.api','smartfuse.services'])

.run(function($ionicPlatform,$rootScope,$state,UserService) {
  
  var noAuthRoutes = ['/login'];

  // check if current location matches route (uses underscore js) 
  var routeClean = function (route) {
    return (_.find(noAuthRoutes,
      function (noAuthRoute) {
        return _.str.startsWith(route, noAuthRoute);
      }) === undefined)?false:true;
  };

  

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    //change to white header...
    try{
      $cordovaStatusBar.style(1); //Light
    }catch(err){
      console.log("cordovaStatusBar not supported");
    }
  });
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    
    //if the user is not logged in, and they are trying to browse to a secured view...
    if(!UserService.isLoggedIn() && !routeClean(toState.url)) {
      console.log('not logged in')
      // redirect back to login
      //event.preventDefault();
      $location.path('login');
    }
  });
})

//route provider manages the transitions between the states.
//there is a transition for every single screen.
.config(function($stateProvider, $urlRouterProvider) {
  console.log($stateProvider);

  $stateProvider
  .state('login', {
    url: "/login",
    controller:"LoginCtrl",
    templateUrl: "templates/intro.html"
  })

  .state('app', {
    url: "/app",
    abstract:true,
    templateUrl: "templates/menu.html"
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller:"HomeCtrl",
      }
    }
  })

  .state('app.fuses', {
    url: "/fuses",
    views: {
      'menuContent': {
        templateUrl: "templates/fuses.html",
        controller: "FusesCtrl"
      }
    }
  })

  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('app.stats', {
    url: "/stats",
    views: {
      'menuContent': {
        templateUrl: "templates/stats.html",
        controller: "StatsCtrl"
      }
    }
  })

  .state('app.stats.carbon', {
    url: "/carbon",
    views: {
      'carbon': {
        templateUrl: "templates/carbon.html",
      }
    }
  })

  .state('app.stats.power', {
    url: "/power",
    views: {
      'power': {
        templateUrl: "templates/power.html",
      }
    }
  })

  .state('app.stats.price', {
    url: "/price",
    views: {
      'price': {
        templateUrl: "templates/price.html",
      }
    }
  })

  .state('app.hubs', {
    url: "/hubs",
    views: {
      'menuContent': {
        templateUrl: "templates/hubs.html",
        controller: 'HubsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
