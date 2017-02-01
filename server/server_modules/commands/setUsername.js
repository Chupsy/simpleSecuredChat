var socketModule = require('../sockets.js');

module.exports = function (socket, data) {
  var newName = key.decrypt(data.name, 'utf8');
  if (socketModule.isNameAvailable(newName)) {
    var oldName = socket.name;
    socket.name = newName;

    if (socket.room) {
      socketModule.sendMessageToRoom(socket.room, oldName + ' is now known as ' + socket.name, null);
    }
    else {
      socket.emit('newUserName', {
        name: socket.rsa.encrypt(socket.name)
      });
    }
  }
  else {
    socket.emit('message', {message: socket.rsa.encrypt(newName + ' is already in use')});
  }
};
