var rooms = require('../rooms.js');

module.exports = function (socket, data, requestData) {
  if (!data.password) {
    socket.emit('errorAuth', {message: 'No password provided', forceDisconnect: false});
  }
  else {
    var password = global.key.decrypt(data.password, 'utf8');
    requestData.room.setPassword(password)
      .then(()=> socketModule.sendMessageToRoom(socket.room, "The room password has been changed by " + socket.name));
  }
};
