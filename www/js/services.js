angular.module('smartfuse.services', [])

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
})
.factory( 'FuseService', function() {

  var fuses = JSON.parse(window.localStorage['fuses']||null);

  return {
    storeFuses:function(fuses){
      window.localStorage['fuses'] = JSON.stringify(fuses);
      fuses = fuses;
    },
    getFuse:function(id){
      for(var i=0;i<fuses.length;i++){
        console.log("'"+fuses[i].id+"'","'"+id+"'",typeof fuses[i].id,String(fuses[i].id)==id);
        if(fuses[i].id==id)
          return fuses[i];
      }
      return null;
    },
    isCached:function(){
      if(fuses===null)
        return false;
      return true;
    },
    fuses: function() {
      return fuses;
    }
  };
});