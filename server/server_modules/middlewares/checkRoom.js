var rooms = require('./../rooms');

module.exports = function(socket, requestData){
  return new Promise(function (resolve, reject) {
    if (socket.room) {
      requestData.room = rooms.getRoom(socket.room);
      resolve();
    }
    else {
      reject({name : 'errorAuth',message: 'You have no room', forceDisconnect: false});
    }
  });
};