module.exports = function(socket, requestData){
  return new Promise(function (resolve) {
    if (requestData.room.isAdmin(socket.id)) {
      resolve();
    }
    else{
      reject({name : 'errorAuth',message: 'You are not admin of the channel', forceDisconnect: false});
    }
  });
};