var sockets = require('../sockets.js').list;
var socketModule = require('../sockets.js');
var rooms = require('../rooms.js');
var rsa = require('./rsa.js');

exports.process = function(socket){
  socket.on('unban', function (data) {
    rsa.check(socket, function(){
      rooms.check(socket, function(room){
        rooms.checkAdminValidity(socket, function() {
          if (!data.userName) {
            socket.emit('errorAuth', {message: 'No user provided', forceDisconnect: false});
          }
          else {
            var userName = key.decrypt(data.userName, 'utf8');
            var socketToRemove = socketModule.getSocketFromUsername(userName);
            room.removeBan(socketToRemove.id, function (err) {
              if (err) {
                socket.emit('errorAuth', {message: 'User ' + userName + ' ' + err.message, forceDisconnect: false});
              }
              else {
                socketModule.sendMessageToRoom(room, userName + " was unbanned from the channel", null);
                socketToRemove.emit('message', {noRoom: true, message: socketToRemove.rsa.encrypt('You were unbanned from channel' + socket.room + ' by ' + socket.name)});
              }
            });
          }
        });
      });
    });
  });
};
