angular.module('smartfuse.services')

.factory( 'SocketService', function(socketFactory,UserService) {
  //provides the live data view... push from the server to the client.

  //connect to the server
  var socket = io.connect("http://scc-devine.lancs.ac.uk:8000");

  //create a socket instance
  var socketInstance = socketFactory({
      ioSocket:socket
  });
  
  //when connected, register the userid against this socket...
  socketInstance.on('connect',function() {
    socket.emit('setUserID',{userid:UserService.currentUser().id});
  });

  //return an instance of the socket.
  return socketInstance;
});