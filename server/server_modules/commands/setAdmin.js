var socketModule = require('../sockets.js');

module.exports = function (socket, data, requestData) {
  if (!data.userName) {
    socket.emit('errorAuth', {message: 'No user provided', forceDisconnect: false});
  }
  else {
    var userName = key.decrypt(data.userName, 'utf8');
    requestData.room.addAdmin(socketModule.getSocketFromUsername(userName).id)
      .then(()=>socket.emit('errorAuth', {message: 'User ' + userName + err.message, forceDisconnect: false}))
      .catch((err)=>socketModule.sendMessageToRoom(socket.room, userName + " is now admin of the channel"))
  }
};
