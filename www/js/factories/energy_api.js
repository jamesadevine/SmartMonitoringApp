angular.module('smartfuse.api')

.factory('EnergyAPI', function ($http){
  return {
    stats:function(date){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/stats',
            params:{date:date},
            timeout:10000,
            method: 'GET',
            headers:{
              "Content-Type": "application/json"
            }
          }).then(function (response) {
            if (response.data.error) {
              return null;
            } else {
              return response.data;
            }
          }, function(err) {
            return {error: "The server timed out!"};
          });
    },
    historic:function(date){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/stats/historic',
            params:{date:date},
            method: 'GET',
            timeout:10000,
            headers:{
              "Content-Type": "application/json"
            }
          }).then(function (response) {
            if (response.data.error) {
              return null;
            } else {
              return response.data;
            }
          }, function(err) {
            return {error: "The server timed out!"};
          });
    },
    current:function(date){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/stats/current',
            params:{date:date},
            timeout:10000,
            method: 'GET',
            headers:{
              "Content-Type": "application/json"
            }
          }).then(function (response) {
            if (response.data.error) {
              return null;
            } else {
              return response.data;
            }
          }, function(err) {
            return {error: "The server timed out!"};
          });
    },
  };
});