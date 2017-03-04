var socketModule = require('../sockets.js');

module.exports = function (socket,data,requestData) {
    var room = requestData.room;
    if (!data.userName) {
      socket.emit('errorAuth',{message: 'No user provided', forceDisconnect: false});
    }
    var userName = key.decrypt(data.userName, 'utf8');
    var socketToRemove = socketModule.getSocketFromUsername(userName);
    room.addBan(socketToRemove.id)
      .then(function () {
        socketToRemove.room = null;
        return room.removeUser(socketToRemove.id);
      })
      .then(function(){
        socketModule.sendMessageToRoom(socket.room, userName + " was banned from the channel", null);
        socketToRemove.emit('message', {
          noRoom: true,
          message: socketToRemove.rsa.encrypt('You were banned from channel by ' + socket.name)
        });
      })
      .catch(function(err){
        socket.emit('errorAuth',{message: 'User ' + userName + ' ' + err.message, forceDisconnect: false});
      });
};

