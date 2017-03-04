module.exports = function(socket){
  return new Promise(function (resolve, reject) {
    if (socket.rsa) {
      resolve();
    }
    else {
      sockets[socket.id] = null;
      reject({name : 'errorAuth',message: 'no RSA set', forceDisconnect: true});
    }
  });
};