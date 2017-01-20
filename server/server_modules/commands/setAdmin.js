var sockets = require('../sockets.js').list;
var socketModule = require('../sockets.js');
var rooms = require('../rooms.js');
var rsa = require('./rsa.js');

exports.process = function (socket) {
  socket.on('setAdmin', function (data) {
    rsa.check(socket)
      .then(function () {
        return rooms.check(socket);
      })
      .then(function (room) {
        rooms.checkAdminValidity(socket)
          .then(function () {
            if (!data.userName) {
              socket.emit('errorAuth', {message: 'No user provided', forceDisconnect: false});
            }
            else {
              var userName = key.decrypt(data.userName, 'utf8');
              room.addAdmin(socketModule.getSocketFromUsername(userName).id, function (err) {
                if (err) {
                  socket.emit('errorAuth', {message: 'User ' + userName + err.message, forceDisconnect: false});
                }
                else {
                  socketModule.sendMessageToRoom(socket.room, userName + " is now admin of the channel");
                }
              });
            }
          });
      });
  });
};
