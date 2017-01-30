var sockets = require('../sockets.js').list;
var socketModule = require('../sockets.js');
var rooms = require('../rooms.js');
var rsa = require('./rsa.js');

exports.process = function (socket) {
  var localState = {};
  socket.on('ban', function (data) {
    rsa.check(socket)
      .then(function () {
        return rooms.check(socket);
      })
      .then(function (room) {
        localState.room = room;
        return rooms.checkAdminValidity(socket);
      })
      .then(function () {
        var room = localState.room;
        if (!data.userName) {
          socket.emit('errorAuth', {message: 'No user provided', forceDisconnect: false});
        }
        else {
          var userName = key.decrypt(data.userName, 'utf8');
          var socketToRemove = socketModule.getSocketFromUsername(userName);
          return room.addBan(socketToRemove.id)
            .then(function () {
                socketToRemove.room = null;
                room.removeUser(socketToRemove.id, function (err) {
                  socketModule.sendMessageToRoom(socket.room, userName + " was banned from the channel", null);
                  socketToRemove.emit('message', {
                    noRoom: true,
                    message: socketToRemove.rsa.encrypt('You were banned from channel by ' + socket.name)
                  });
                });
          })
            .catch(function(err){
              socket.emit('errorAuth', {message: 'User ' + userName + ' ' + err.message, forceDisconnect: false});
            });
        }
      });
  });
};
