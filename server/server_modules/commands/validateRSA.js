module.exports = function(socket,data){
  if (socket.tmprsa && socket.validateKey && data.validateKey &&
    socket.validateKey == global.key.decrypt(data.validateKey, 'utf8')) {
    socket.rsa = socket.tmprsa;
    socket.tmprsa = null;
    socket.emit('validateSuccess', {
      name: socket.rsa.encrypt(socket.name)
    });
  }
  else {
    socket.emit('errorAuth', {message: 'RSA validation failed', forceDisconnect: true});
    sockets[socket.id] = null;
  }
};
