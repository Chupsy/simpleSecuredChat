var sockets = require('../sockets.js').list;
var socketModule = require('../sockets.js');
var rsa = require('./rsa.js');

exports.process = function (socket) {
  socket.on('whisper', function (data) {
    rsa.check(socket)
      .then(function () {
        if (data.userName && data.message) {
          var message = key.decrypt(data.message, 'utf8');
          var userName = key.decrypt(data.userName, 'utf8');
          var socketToSendTo = socketModule.getSocketFromUsername(userName);
          if (socketToSendTo) {
            if (socketToSendTo.id == socket.id) {
              socket.emit('errorAuth', {
                message: 'you cannot send private messages to yourself',
                forceDisconnect: false
              });
            }
            else {
              var dataToSend = {
                userName: socketToSendTo.rsa.encrypt('from ' + socket.name),
                message: socketToSendTo.rsa.encrypt(message),
                isWhisper: true
              };
              socketToSendTo.emit('message', dataToSend);
              var dataToSendToLocal = {
                userName: socket.rsa.encrypt('to ' + userName),
                message: socket.rsa.encrypt(message),
                isWhisper: true
              };
              socket.emit('message', dataToSendToLocal);
            }
          }
          else {
            socket.emit('errorAuth', {message: 'User ' + userName + ' does not exist', forceDisconnect: false});
          }
        }
        else {
          socket.emit('errorAuth', {message: 'No name or message available', forceDisconnect: false});
        }
      });
  });
};
