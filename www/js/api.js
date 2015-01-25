angular.module('smartfuse.api', ['smartfuse.services'])

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
          data:{id:id,name:email,email:email,countryCode:countryCode,houseSize:houseSize},
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