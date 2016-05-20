var sockets = require('../sockets.js').list;
var socketModule = require('../sockets.js');
var rooms = require('../rooms');
var rsa = require('./rsa.js');


exports.process = function(socket){
  socket.on('join', function (data) {
    rsa.check(socket, function(){
      var roomId = key.decrypt(data.id, 'utf8');
      var room = rooms.getRoom(roomId);
      room.addUser(socket.id, function(err, isAdmin){
        if(err){
          socket.emit('message', {noRoom:true,message : socket.rsa.encrypt('User ' + err.message)});
        }
        else{
          if(socket.room){
            rooms.getRoom(socket.room).removeUser(socket.id, function(){
              socketModule.sendMessageToRoom(socket.room,socket.name + ' has left the room', null, socket.id);
            });
          }
          socket.room = roomId;
          socketModule.sendMessageToRoom(socket.room,socket.name + ' has joined the room', null);
          if(isAdmin){
            socketModule.sendMessageToRoom(socket.room,socket.name + ' is now admin of the room', null);
          }
        }
      });
    });
  });

};
