var sockets = require('../sockets.js').list;
var socketModule = require('../sockets.js');
var rooms = require('../rooms.js');

exports.process = function(socket){
  socket.on('disconnect', function(){
    if(socket.room){
      rooms.getRoom(socket.room).removeUser(socket.id, function(err){
        if(!err){
          socketModule.sendMessageToRoom(socket.room,socket.name + ' has left the room', null, socket.id);
        }
      });
    }
    socketModule.removeSocket(socket.id);
  });
};
