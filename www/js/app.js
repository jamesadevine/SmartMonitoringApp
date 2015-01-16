// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('smartfuse', ['ionic', 'smartfuse.controllers','smartfuse.api','smartfuse.services'])

.run(function($ionicPlatform,$rootScope,$state,UserService) {
  var routesThatDontRequireAuth = ['/login'];

  // check if current location matches route  
  var routeClean = function (route) {
    return _.find(routesThatDontRequireAuth,
      function (noAuthRoute) {
        return _.str.startsWith(route, noAuthRoute);
      });
  };

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    //console.log(toState,UserService.isLoggedIn());
    //console.log(UserService.currentUser());
    

    if (!routeClean(toState.url) && !UserService.isLoggedIn()) {
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
        templateUrl: "templates/home.html"
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
  .state('app.fuses.fuse', {
    url: "/playlists",
    views: {
      'menuContent': {
        templateUrl: "templates/playlists.html",
        controller: 'PlaylistsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
