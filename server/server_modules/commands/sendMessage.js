var socketModule = require('../sockets.js');

module.exports = function (socket,data, requestData) {
  var message = key.decrypt(data.message, 'utf8');
  var isAdmin = requestData.room.isAdmin(socket.id) ? true : false;
  socketModule.sendMessageToRoom(socket.room, message, socket.name, null, isAdmin);
};
