angular.module('smartfuse.services')

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
});