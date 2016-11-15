var socketModule = require('../sockets.js');
var rooms = require('../rooms.js');
var rsa = require('./rsa.js');

exports.process = function(socket){
  socket.on('setRoomPassword', function (data) {
    rsa.check(socket, function(){
      rooms.check(socket, function(room){
        rooms.checkAdminValidity(socket, function(){
          if(!data.password){
            socket.emit('errorAuth',{message : 'No password provided', forceDisconnect:false});
          }
          else{
            var password = global.key.decrypt(data.password, 'utf8');
            room.setPassword(password, function(){
                socketModule.sendMessageToRoom(socket.room, "The room password has been changed by " + socket.name);
            });
          }
        });
      });
    });
  });
};
