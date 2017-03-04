var socketModule = require('../sockets.js');

module.exports = function (socket, data, requestData) {
  if (!data.userName) {
    return socket.emit('errorAuth', {message: 'No user provided', forceDisconnect: false});
  }
  var userName = key.decrypt(data.userName, 'utf8');
  var socketToRemove = socketModule.getSocketFromUsername(userName);
  requestData.room.removeUser(socketToRemove.id)
    .then(function(){
      socketModule.sendMessageToRoom(socket.room, userName + " was kicked from the channel", null);
      socketToRemove.room = null;
      socketToRemove.emit('message', {
        noRoom: true,
        message: socketToRemove.rsa.encrypt('You were kicked from channel by ' + socket.name)
      });
    })
    .catch(function(err){
      socket.emit('errorAuth', {message: 'User ' + userName + ' ' + err.message, forceDisconnect: false});

    });
};
