angular.module('smartfuse.services')

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
});