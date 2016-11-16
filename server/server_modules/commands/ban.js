var sockets = require('../sockets.js').list;
var socketModule = require('../sockets.js');
var rooms = require('../rooms.js');
var rsa = require('./rsa.js');

exports.process = function(socket){
  socket.on('ban', function (data) {
    rsa.check(socket)
      .then(function() {
        return rooms.check(socket);
      })
      .then(function(room){
        rooms.checkAdminValidity(socket, function() {
          if(!data.userName){
            socket.emit('errorAuth',{message : 'No user provided', forceDisconnect:false});
          }
          else{
            var userName = key.decrypt(data.userName, 'utf8');
            var socketToRemove = socketModule.getSocketFromUsername(userName);
            room.addBan(socketToRemove.id, function(err){
              if(err){
                socket.emit('errorAuth',{message : 'User ' + userName + ' ' + err.message, forceDisconnect:false});
              }
              else{
                socketToRemove.room = null;
                room.removeUser(socketToRemove.id, function(err){
                  socketModule.sendMessageToRoom(socket.room, userName + " was banned from the channel", null);
                  socketToRemove.emit('message', {noRoom:true,message : socketToRemove.rsa.encrypt('You were banned from channel by ' + socket.name)});
                });
              }
            });
          }
        });
      })

  });
};
