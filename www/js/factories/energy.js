angular.module('smartfuse.services')

.factory( 'EnergyService', function(CacheService) {

  //get the list of fuses from the cache if it exists...
  var fuses = CacheService.get('fuses');

  return {

    //store the summary  in the cache
    storeSummary:function(date,summary){
      console.log("storing summary: ",summary);
      CacheService.store(summary,"energy-summary"+date);
    },

    //retrieve the summary from the cache.
    getSummary:function(date){
      return CacheService.get("energy-summary"+date);
    }

  };
});