angular.module('smartfuse.api')
.factory( 'HubAPI', function ($http,UserService){
  return {
    //get all hubs
    hubs:function(userid){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/hubs',
          params:{userID:userid},
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
    //link a hub with the current user account
    link:function(id,ownerid){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/hub',
          data:{hubID:id,userID:ownerid},
          timeout:10000,
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
    //change the name of a hub
    edit:function(id,ownerid,name){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/hub',
          data:{hubID:id,userID:ownerid,name:name},
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
    //remove a hub from the project
    remove:function(hubID,userID){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/hub/',
            data:{hubID:hubID,
              userID:userID
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