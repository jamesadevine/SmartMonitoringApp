angular.module('smartfuse.api')

/*
  Appliances were previously known as fuses, but the project was rebranded too late

  All usages of the word fuse can be replaced by Appliance.
*/
.factory( 'FuseAPI', function ($http){
  return {
    //get a single appliance
    fuse:function(id,userID){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliance',
            params:{applianceID:id,userID:userID},
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
    //get all appliances
    fuses:function(userID){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliances',
            params:{userID:userID},
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
    //get the overall summary for all appliances
    summary:function(userID,date){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliances/summary',
            params:{userID:userID,date:date},
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
    //get the seven day summary for a particular appliance
    sevenDaySummary:function(userID,applianceid,hubid){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliance/summary',
            params:{userID:userID,applianceID:applianceid,hubID:hubid},
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
    //upload an image for a particular appliance
    upload:function(userID,applianceID,hubID,image){
    return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliance/upload',
            timeout:10000,
            data:{userID:userID,
              applianceID:applianceID,
              hubID:hubID,
              image:image},
            method: 'POST',
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
    //edit a particular appliance
    edit:function(userID,applianceID,hubID,applianceName,applianceDescription){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliance',
            data:{userID:userID,
              applianceID:applianceID,
              applianceName:applianceName,
              hubID:hubID,
              applianceDescription:applianceDescription,
            },
            timeout:10000,
            method: 'PUT',
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
    //remove and appliance
    remove:function(userID,applianceID,hubID){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliance/',
            data:{userID:userID,
              applianceID:applianceID,
              hubID:hubID
            },
            timeout:10000,
            method: 'DELETE',
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
    }
  };
});