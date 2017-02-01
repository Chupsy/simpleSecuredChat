var socketModule = require('../sockets.js');

module.exports = function (socket,data, requestData) {
  if (!data.userName) {
    socket.emit('errorAuth', {message: 'No user provided', forceDisconnect: false});
  }
  else {
    var userName = key.decrypt(data.userName, 'utf8');
    var socketToRemove = socketModule.getSocketFromUsername(userName);
    requestData.room.removeBan(socketToRemove.id)
      .then(function () {
        socketModule.sendMessageToRoom(socket.room, userName + " was unbanned from the channel", null);
        socketToRemove.emit('message', {
          noRoom: true,
          message: socketToRemove.rsa.encrypt('You were unbanned from channel ' + socket.room + ' by ' + socket.name)
        });
      })
      .catch(function (err) {
        socket.emit('errorAuth', {message: 'User ' + userName + ' ' + err.message, forceDisconnect: false});
      })
  }
};
