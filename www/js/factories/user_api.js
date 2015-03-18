angular.module('smartfuse.api')

.factory( 'UserAPI', function ($http,UserService){
  return {
    login:function(email,password){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/user/',
          params:{email:email,password:password},
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
            if(err.data)
              return err.data;
            else
              return "The server timed out!";
        });
    },
    register:function(email,password,name){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/user/',
          data:{email:email,password:password,name:name},
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
            if(err.data)
              return err.data;
            else
              return "The server timed out!";
          });
    },
    update:function(id,name,email,countryCode,houseSize){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/user',
          data:{userID:id,name:name,email:email,countryCode:countryCode,houseSize:houseSize},
          method: 'PUT',
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
            if(err.data)
              return err.data;
            else
              return "The server timed out!";
          });
    }
  };
})
.factory( 'HubAPI', function ($http,UserService){
  return {
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