var sockets = require('../sockets.js').list;
var uuid = require('node-uuid');
var NodeRSA = require('node-rsa');
module.exports.process = function (socket) {
  socket.emit('rsa', {key: global.key.exportKey('public')});
  socket.on('setRSA', function (data) {
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
  });
  socket.on('validateRSA', function (data) {
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
  });
};

module.exports.check = function (socket) {
  return new Promise(function (resolve, reject) {
    if (socket.rsa) {
      resolve();
    }
    else {
      socket.emit('errorAuth', {message: 'no RSA set', forceDisconnect: true});
      sockets[socket.id] = null;
      reject();
    }
  });

};