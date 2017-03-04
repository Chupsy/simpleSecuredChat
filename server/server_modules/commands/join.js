var socketModule = require('../sockets.js');
var rooms = require('../rooms');

module.exports = function (socket, data) {
  var roomId = global.key.decrypt(data.id, 'utf8');
  var password;
  if (data.password) {
    password = global.key.decrypt(data.password, 'utf8');
  }
  var room = rooms.getRoom(roomId);
  if (!room.hasPassword() || password) {
    if (password == room.password) {
      room.addUser(socket.id)
        .then(function (isAdmin) {
          if (socket.room) {
            rooms.getRoom(socket.room).removeUser(socket.id)
              .then(()=>socketModule.sendMessageToRoom(socket.room, socket.name + ' has left the room', null, socket.id));
          }
          socket.room = roomId;
          socketModule.sendMessageToRoom(socket.room, socket.name + ' has joined the room', null);
          if (isAdmin) {
            socketModule.sendMessageToRoom(socket.room, socket.name + ' is now admin of the room', null);
          }
        })
        .catch(function (err) {
          socket.emit('message', {noRoom: true, message: socket.rsa.encrypt('User ' + err.message)});
        });
    }
    else {
      socket.emit('message', {message: socket.rsa.encrypt('Password is invalid. You cannot access ' + room.name)});
    }
  }
  else {
    socket.emit('passwordRequested', {roomId: socket.rsa.encrypt(roomId)});
  }
};
