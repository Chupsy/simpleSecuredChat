var socketModule = require('../sockets.js');
var rooms = require('../rooms.js');

module.exports = function (socket) {
    if (socket.room) {
      rooms.getRoom(socket.room).removeUser(socket.id)
        .then(function(){
          socketModule.sendMessageToRoom(socket.room, socket.name + ' has left the room', null, socket.id);
      });
    }
    socketModule.removeSocket(socket.id);
};
