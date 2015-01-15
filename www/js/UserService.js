angular.module('smartfuse.UserService', [])

.factory( 'UserService', function() {
  var currentUser = JSON.parse(window.localStorage['user']||null);
  console.log("CURRENT USER ",currentUser);
  return {
    login:function(user){
      console.log("Logged in ",user);
      window.localStorage['user'] = JSON.stringify(user);
      currentUser = user;
      console.log("current user",currentUser,JSON.parse(window.localStorage['user']));
    },
    logout:function(){
      delete window.localStorage['user'];
      currentUser = null;
    },
    isLoggedIn: function() {
      if(typeof currentUser === 'undefined' || currentUser === null)
        return false;
      return true;
    },
    currentUser: function() {
      console.log(currentUser);
      return currentUser;
    }
  };
});