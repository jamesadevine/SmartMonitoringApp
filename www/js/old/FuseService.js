angular.module('smartfuse.FuseService', [])

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