angular.module('smartfuse.services')

.factory( 'UserService', function(CacheService) {

  //get the user object from the cache if it exists
  var currentUser = CacheService.get('user');

  return {

    //sets the current user to the provided user object, stores it locally in the cache
    login:function(user){
      console.log("Logged in ",user);
      CacheService.store(user,'user');
      currentUser = user;
    },
    //wipes all data in the cahce.
    logout:function(){
      CacheService.deleteAll();
      currentUser = null;
    },
    //checks to see if the user is logged in
    isLoggedIn: function() {
      if(typeof currentUser === 'undefined' || currentUser === null)
        return false;
      return true;
    },
    //returns the current user
    currentUser: function() {
      return currentUser;
    }
  };
});