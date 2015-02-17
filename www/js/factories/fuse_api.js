angular.module('smartfuse.api')

.factory( 'FuseAPI', function ($http){
  return {
    fuse:function(id,userID){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/fuse',
            params:{fuseID:id,userID:userID},
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
            url:'http://scc-devine.lancs.ac.uk:8000/api/fuses',
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
            url:'http://scc-devine.lancs.ac.uk:8000/api/fuses/summary',
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
    sevenDaySummary:function(userID,fuseid,hubid){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/fuse/summary',
            params:{userID:userID,fuseID:fuseid,hubID:hubid},
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
    upload:function(userID,fuseID,hubID,image){
    return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/fuse/upload',
            timeout:10000,
            data:{userID:userID,
              fuseID:fuseID,
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
    edit:function(userID,fuseID,hubID,fuseName,fuseDescription){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/fuse',
            data:{userID:userID,
              fuseID:fuseID,
              fuseName:fuseName,
              hubID:hubID,
              fuseDescription:fuseDescription,
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
    remove:function(userID,fuseID,hubID){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/fuse/',
            data:{userID:userID,
              fuseID:fuseID,
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