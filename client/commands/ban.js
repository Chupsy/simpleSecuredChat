/*global appendToBox*/
var NodeRSA = require('node-rsa');
var helper = require('./../helper.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "ban") {
    if (helper.getData(line)) {
      user.socket.emit('ban', {userName:user.serverKey.encrypt(helper.getData(line))});
    }
    else {
      appendToBox("No user name provided  (/help to get help)", 'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- ban : ban a user from the room (ex : /ban Toto)');
};
