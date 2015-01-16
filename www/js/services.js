angular.module('smartfuse.services', [])
.factory( 'CacheService', function() {
  return {
    store:function(object, cacheName){
      console.log("Storing object ",object," with name: "+cacheName);
      window.localStorage[cacheName] = JSON.stringify(object);
    },
    get:function(cacheName){
      console.log("Fetching object with name: "+cacheName);
      return window.localStorage[cacheName];
    },
    delete: function(cacheName) {
      console.log("Deleting object with name: "+cacheName);
      delete window.localStorage[cacheName];
    }
  };
})
.factory( 'UserService', function(CacheService) {
  var currentUser = JSON.parse(CacheService.get('user')||null);
  console.log("CURRENT USER ",currentUser);
  return {
    login:function(user){
      console.log("Logged in ",user);
      CacheService.store(user,'user');
      currentUser = user;
    },
    logout:function(){
      CacheService.delete('user');
      CacheService.delete('fuses');
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
.factory( 'FuseService', function(CacheService) {

  var fuses = JSON.parse(CacheService.get('fuses')||null);

  return {
    storeFuses:function(newfuses){
      CacheService.store(newfuses,'fuses');
      fuses = newfuses;
    },
    getFuse:function(id){
      for(var i=0;i<fuses.length;i++){
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