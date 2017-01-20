var sockets = require('../sockets.js').list;
var socketModule = require('../sockets.js');
var rooms = require('../rooms.js');
var rsa = require('./rsa.js');

exports.process = function (socket) {
  socket.on('sendMessage', function (data) {
    rsa.check(socket)
      .then(function () {
        return rooms.check(socket);
      })
      .then(function (room) {
        var message = key.decrypt(data.message, 'utf8');
        var isAdmin = room.isAdmin(socket.id) ? true : false;
        socketModule.sendMessageToRoom(socket.room, message, socket.name, null, isAdmin);
      });
  });
};
