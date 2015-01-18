angular.module('smartfuse.services', [])
.factory( 'CacheService', function() {
  return {
    store:function(object, cacheName){
      console.log("Storing object ",object," with name: "+cacheName);
      object.lastUpdated = moment().format("DD-MM-YY");
      window.localStorage[cacheName] = JSON.stringify(object);
    },
    get:function(cacheName){
      console.log("Fetching object with name: "+cacheName);
      return JSON.parse(window.localStorage[cacheName]||null);
    },
    delete: function(cacheName) {
      console.log("Deleting object with name: "+cacheName);
      delete window.localStorage[cacheName];
    }
  };
})
.factory( 'UserService', function(CacheService) {
  var currentUser = CacheService.get('user');
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

  var fuses = CacheService.get('fuses');

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
    },
    storeSummary:function(date,summary){
      console.log("storing summary: ",summary);
      CacheService.store(summary,"summary"+date);
    },
    getSummary:function(date){
      return CacheService.get("summary"+date);
    }
  };
})
.factory( 'SocketService', function(socketFactory,UserService) {
  var socket = io.connect("http://scc-devine.lancs.ac.uk:8000");
  var socketInstance = socketFactory({
      ioSocket:socket
    });
  socketInstance.emit('setUserID',{userid:UserService.currentUser().id});
  socketInstance.forward('dataAdded');
  return socketInstance;
});