angular.module('smartfuse.api')

.factory( 'UserAPI', function ($http,UserService){
  return {
    //log a user in by obtaining their user details
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
    //register a user with the project
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
    //update a user
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
});
