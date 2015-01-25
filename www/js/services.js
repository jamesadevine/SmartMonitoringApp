angular.module('smartfuse.services', [])

/*
  ---------CACHE SERVICE---------
*/

.factory( 'CacheService', function() {
  return {
    //Store the object using the given name
    store:function(object, cacheName){
      console.log("Storing object ",object," with name: "+cacheName);
      object.lastUpdated = moment().format("DD-MM-YY");
      //stringify the js object
      window.localStorage[cacheName] = JSON.stringify(object);
    },
    //retrieve the object and turn it back into a js object
    get:function(cacheName){
      console.log("Fetching object with name: "+cacheName);
      return JSON.parse(window.localStorage[cacheName]||null);
    },
    //delete a variable from the cache
    delete: function(cacheName) {
      console.log("Deleting object with name: "+cacheName);
      delete window.localStorage[cacheName];
    },
    //removes all locally store data
    deleteAll:function(){
      window.localStorage.clear();
    }
  };
})

/*
  ---------USER SERVICE---------
*/

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
})

/*
  ---------FUSE SERVICE---------
*/

.factory( 'FuseService', function(CacheService) {

  //get the list of fuses from the cache if it exists...
  var fuses = CacheService.get('fuses');

  return {

    //store the fuse object in the cache
    storeFuses:function(newfuses){
      CacheService.store(newfuses,'fuses');
      fuses = newfuses;
    },

    //find a specific fuse using the id and hubid
    getFuse:function(id,hubID){
      var keys = Object.keys(fuses);
      for(var i=0;i<keys.length;i++){
        for(var j=0;j<fuses[keys[i]].length;j++)
          if(fuses[keys[i]][j].id==id &&fuses[keys[i]][j].hubID==hubID)
            return fuses[keys[i]][j];
      }
      return null;
    },
    //determine if there is a cached version of the fuses
    isCached:function(){
      if(fuses===null)
        return false;
      return true;
    },

    //retrieve the fuses object
    fuses: function() {
      return fuses;
    },

    //store the summary  in the cache
    storeSummary:function(date,summary){
      console.log("storing summary: ",summary);
      CacheService.store(summary,"summary"+date);
    },

    //retrieve the summary from the cache.
    getSummary:function(date){
      return CacheService.get("summary"+date);
    }
  };
})

/*
  ---------HUB SERVICE---------
*/

.factory( 'HubService', function(CacheService) {

  //get the list of hubs from the cache if it exists
  var hubs = CacheService.get('hubs');

  return {
    //store the hubs object in the cache
    storeHubs:function(newhubs){
      CacheService.store(newhubs,'hubs');
      hubs = newhubs;
    },
    //retrieve a particular hub from the cache
    getHub:function(id){
      for(var i=0;i<hubs.length;i++){
        if(hubs[i].id==id)
          return hubs[i];
      }
      return null;
    },
    //check if a cached version exists
    isCached:function(){
      if(hubs===null)
        return false;
      return true;
    },
    //return the hubs object
    hubs: function() {
      return hubs;
    }
  };
})

/*
  ---------SOCKET SERVICE---------
*/

.factory( 'SocketService', function(socketFactory,UserService) {
  //provides the live data view... push from the server to the client.

  //connect to the server
  var socket = io.connect("http://scc-devine.lancs.ac.uk:8000");

  //create a socket instance
  var socketInstance = socketFactory({
      ioSocket:socket
  });
  
  //when connected, register the userid against this socket...
  socketInstance.on('connect',function() {
    socket.emit('setUserID',{userid:UserService.currentUser().id});
  });

  //return an instance of the socket.
  return socketInstance;
});