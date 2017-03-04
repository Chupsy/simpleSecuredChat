var socketModule = require('../sockets.js');

module.exports = function (socket,data) {
  if (data.userName) {
    var userName = key.decrypt(data.userName, 'utf8');
    var socketToSendTo = socketModule.getSocketFromUsername(userName);
    if (socketToSendTo) {
      if (socketToSendTo.id == socket.id) {
        socket.emit('errorAuth', {message: 'you cannot send a wizz to yourself', forceDisconnect: false});
      }
      else {
        var dataToSend = {
          userName: socketToSendTo.rsa.encrypt(socket.name)
        };
        socketToSendTo.emit('wizz', dataToSend);
        var dataToSendToLocal = {
          message: socket.rsa.encrypt("you just wizzed " + userName),
          color: 'yellow'
        };
        socket.emit('message', dataToSendToLocal);
      }
    }
    else {
      socket.emit('errorAuth', {message: 'User ' + userName + ' does not exist', forceDisconnect: false});
    }
  }
  else {
    socket.emit('errorAuth', {message: 'No name sent', forceDisconnect: false});
  }
};
