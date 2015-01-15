angular.module('smartfuse.api', ['smartfuse.UserService','smartfuse.FuseService'])

.factory( 'FuseAPI', function ($http){
  var getFuse = function(id,userID){
    return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/user/login',
          data:{email:email,password:password},
          method: 'POST',
          headers:{
            "Content-Type": "application/json"
          }
        }).then(function (response) {
          console.log("RESP", response);
         if (response.data.error) {
             return null;
         } else {
             console.log(response.data);
             return response.data;
         }
        }, function(err) {
          return err.data;
        }
    );
  };
  var getFuses = function(userID){
    return $http({
          url:'http://scc-devine.lancs.ac.uk:8000/api/fuse/fuses',
          data:{userID:userID},
          method: 'POST',
          headers:{
            "Content-Type": "application/json"
          }
        }).then(function (response) {
          console.log("RESP", response);
         if (response.data.error) {
             return null;
         } else {
             console.log(response.data);
             return response.data;
         }
        }, function(err) {
          return err.data;
        }
    );
  };
  return {
    fuse:getFuse,
    fuses:getFuses
  };
})

.factory( 'UserAPI', function ($http,UserService){
  var login = function(email,password){
    return $http({
        url:'http://scc-devine.lancs.ac.uk:8000/api/user/login',
        data:{email:email,password:password},
        method: 'POST',
        headers:{
          "Content-Type": "application/json"
        }
      }).then(function (response) {
        console.log("RESP", response);
       if (response.data.error) {
           return null;
       } else {
           console.log("RESP2",response.data.user);
           UserService.login(response.data.user);
           return response.data;
       }
      }, function(err) {
        return err.data;
      }
  );

  };
  var register = function(){

  };
  return {
    login:login,
    register:register
  };
});