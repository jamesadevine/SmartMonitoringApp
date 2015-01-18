// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('smartfuse', ['ionic','btford.socket-io','chart.js', 'smartfuse.controllers','smartfuse.api','smartfuse.services'])

.run(function($ionicPlatform,$rootScope,$state,UserService) {
  
  var routesThatDontRequireAuth = ['/login'];

  // check if current location matches route  
  var routeClean = function (route) {
    return (_.find(routesThatDontRequireAuth,
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
    /*if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }*/
    try{
      $cordovaStatusBar.style(1); //Light
    }catch(err){
      console.log("cordovaStatusBar not supported");
    }
  });
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    //console.log(toState,UserService.isLoggedIn());
    //console.log(UserService.currentUser());

    console.log(routeClean("/login"));

    console.log("tostate ",toState.url," logged in? ",UserService.isLoggedIn()," routeClean ",routeClean(toState.url));
    if(!UserService.isLoggedIn() && !routeClean(toState.url)) {
      console.log("shouldn't be true!!");
      // redirect back to login
      event.preventDefault();
      $state.transitionTo('login');
    }
  });
})

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
        reload:true
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
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
