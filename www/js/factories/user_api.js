angular.module('smartfuse.api')

.factory( 'UserAPI', function ($http,UserService){
  return {
    login:function(email,password){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/user/login',
          data:{email:email,password:password},
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
    register:function(email,password,name){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/user/register',
          data:{email:email,password:password,name:name},
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
    update:function(id,name,email,countryCode,houseSize){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/user',
          data:{id:id,name:name,email:email,countryCode:countryCode,houseSize:houseSize},
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
    }
  };
})
.factory( 'HubAPI', function ($http,UserService){
  return {
    hubs:function(userid){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/hubs',
          params:{userID:userid},
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
    link:function(id,ownerid){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/hub',
          data:{hubID:id,userID:ownerid},
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
    edit:function(id,ownerid,name){
      return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/hub',
          data:{hubID:id,userID:ownerid,name:name},
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
    remove:function(hubID,userID){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/hub/',
            data:{hubID:hubID,
              userID:userID
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