var screenCommands = require('./../../screen/commands.js');
var NodeRSA = require('node-rsa');
var moment = require('moment');
exports.apply = function(user){
  user.socket.on('connect', function () {
    screenCommands.appendToBox('connected to server', 'green');
    screenCommands.clearUserScreen();
    screenCommands.setOnUserScreen('No room');
  });
  user.socket.on('rsa', function (data) {
    screenCommands.appendToBox('received RSA server', 'green');
    data.key = data.key.replace('\n', '');
    user.serverKey = new NodeRSA(data.key);
    user.socket.emit('setRSA', {rsa: user.serverKey.encrypt(user.rsa.exportKey('public'))});
    user.keyUpdated = '[server key updated at ' + moment().format('HH:mm:ss') + ']';
    screenCommands.updateKeyTime();
  });

  user.socket.on('updateRSA', function (data) {
    data.key = data.key.replace('\n', '');
    user.serverKey = new NodeRSA(data.key);
    user.keyUpdated = '[server key updated at ' + moment().format('HH:mm:ss') + ']';
    screenCommands.updateKeyTime();
  });

  user.socket.on('errorAuth', function (data) {
    screenCommands.appendToBox(data.message, 'red');
    if (data.forceDisconnect) {
      user.socket.disconnect();
      user.socket = null;
    }
  });
  user.socket.on('validateRSA', function (data) {
    screenCommands.appendToBox('validate RSA client', 'green');
    if (data.key && user.serverKey) {
      var keyToSend = user.rsa.decrypt(data.key, 'utf8');
      user.socket.emit('validateRSA', {validateKey: user.serverKey.encrypt(keyToSend)});
    }
  });

  user.socket.on('validateSuccess', function (data) {
    user.socket.isValid = true;
    screenCommands.appendToBox('Authenticated as ' + user.rsa.decrypt(data.name, 'utf8'), 'green');
    screenCommands.appendToBox('--------------');
    screenCommands.appendToBox('WELCOME');
    screenCommands.appendToBox('--------------');
  });

  user.socket.on('disconnect', function () {
    screenCommands.clearUserScreen();
    screenCommands.setOnUserScreen('disconnected');
    screenCommands.appendToBox('disconnected from server', 'red');
    user.keyUpdated = null;
    if (user.socket) {
      user.socket.isValid = false;
    }
  });

  user.socket.on('connect_error', function (err) {
    user.keyUpdated = null;
    screenCommands.appendToBox('connection error : server probably does not exist or is down', 'red');
  });
  user.socket.on('connect_timeout', function (err) {
    user.keyUpdated = null;
    screenCommands.appendToBox('connection error : connection timed out', 'red');
  });

  user.socket.on('reconnecting', function (number) {
    user.keyUpdated = null;
    if(number>5){
      screenCommands.appendToBox('server unavailable', 'red');
      user.socket.disconnect();
      user.socket = null;
    }
    else{
      screenCommands.appendToBox('reconnecting (' + number + ')', 'red');
    }

  });
};