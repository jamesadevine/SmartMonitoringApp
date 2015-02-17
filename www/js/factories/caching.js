angular.module('smartfuse.services')

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
});