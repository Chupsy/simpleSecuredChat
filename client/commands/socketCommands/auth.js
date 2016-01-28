/*global appendToBox*/
var NodeRSA = require('node-rsa');
exports.apply = function(user){
  user.socket.on('connect', function () {
    appendToBox('connected to server', 'green');
    clearUserScreen();
    setOnUserScreen('No room');
  });
  user.socket.on('rsa', function (data) {
    appendToBox('received RSA server', 'green');
    data.key = data.key.replace('\n', '');
    user.serverKey = new NodeRSA(data.key);
    user.socket.emit('setRSA', {rsa: user.serverKey.encrypt(user.rsa.exportKey('public'))});
  });
  user.socket.on('errorAuth', function (data) {
    appendToBox(data.message, 'red');
    if (data.forceDisconnect) {
      user.socket.disconnect();
      user.socket = null;
    }
  });
  user.socket.on('validateRSA', function (data) {
    appendToBox('validate RSA client', 'green');
    if (data.key && user.serverKey) {
      var keyToSend = user.rsa.decrypt(data.key, 'utf8');
      user.socket.emit('validateRSA', {validateKey: user.serverKey.encrypt(keyToSend)});
    }
  });

  user.socket.on('validateSuccess', function (data) {
    user.socket.isValid = true;
    appendToBox('Authenticated as ' + user.rsa.decrypt(data.name, 'utf8'), 'green');
    appendToBox('');
  });

  user.socket.on('disconnect', function () {
    clearUserScreen();
    setOnUserScreen('disconnected');
    appendToBox('disconnected from server', 'red');
    if (user.socket) {
      user.socket.isValid = false;
    }
  });

  user.socket.on('connect_error', function (err) {
    appendToBox('connection error : server probably does not exist or is down', 'red');
  });
  user.socket.on('connect_timeout', function (err) {
    appendToBox('connection error : connection timed out', 'red');

  });

  user.socket.on('reconnecting', function (number) {
    if(number>5){
      appendToBox('server unavailable', 'red');
      user.socket.disconnect();
      user.socket = null;
    }
    else{
      appendToBox('reconnecting (' + number + ')', 'red');
    }

  });
};