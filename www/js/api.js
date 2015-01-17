angular.module('smartfuse.api', ['smartfuse.services'])

.factory( 'FuseAPI', function ($http){
  return {
    fuse:function(id,userID){
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
    },
    fuses:function(userID){
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
        });
    },
    summary:function(userID,date){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/fuse/fuses/summary',
            data:{userID:userID,date:date},
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
        });
    },
    upload:function(userID,fuseID,image){
    return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/fuse/upload',
            timeout:10000,
            data:{userID:userID,
              fuseID:fuseID,
              image:image},
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
          });
    },
    edit:function(userID,fuseID,fuseName,fuseDescription){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/fuse/edit',
            data:{userID:userID,
              fuseID:fuseID,
              fuseName:fuseName,
              fuseDescription:fuseDescription,
            },
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
          });
    },
    remove:function(userID,fuseID,fuseName,fuseDescription){
      return $http({
            url:'http://scc-devine.lancs.ac.uk:8000/api/fuse/remove',
            data:{userID:userID,
              fuseID:fuseID
            },
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
          });
    }
  };
})

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
      });
    },
    register:function(){

    }
  };
});