var NodeRSA = require('node-rsa');
var uuid = require('node-uuid');
var sockets = require('../sockets.js').list;

module.exports = function(socket, data){
  socket.rsa = null;
  if (data.rsa) {
    socket.tmprsa = new NodeRSA(global.key.decrypt(data.rsa, 'utf8'));
    socket.validateKey = uuid.v4();
    socket.emit('validateRSA', {key: socket.tmprsa.encrypt(socket.validateKey)});
  }
  else {
    socket.emit('errorAuth', {message: 'no RSA set', forceDisconnect: true});
    sockets[socket.id] = null;
  }
};