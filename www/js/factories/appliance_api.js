angular.module('smartfuse.api')

.factory( 'FuseAPI', function ($http){
  return {
    fuse:function(id,userID){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliance',
            params:{applianceID:id,userID:userID},
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
            return err.data;
          });
    },
    fuses:function(userID){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliances',
            params:{userID:userID},
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
            return err.data;
          });
    },
    summary:function(userID,date){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliances/summary',
            params:{userID:userID,date:date},
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
            return err.data;
          });
    },
    sevenDaySummary:function(userID,applianceid,hubid){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliance/summary',
            params:{userID:userID,applianceID:applianceid,hubID:hubid},
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
            return err.data;
          });
    },
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
            return err.data;
          });
    },
    edit:function(userID,applianceID,hubID,applianceName,applianceDescription){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliance',
            data:{userID:userID,
              applianceID:applianceID,
              applianceName:applianceName,
              hubID:hubID,
              applianceDescription:applianceDescription,
            },
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
            return err.data;
          });
    },
    remove:function(userID,applianceID,hubID){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/appliance/',
            data:{userID:userID,
              applianceID:applianceID,
              hubID:hubID
            },
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
            return err.data;
          });
    }
  };
});