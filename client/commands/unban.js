/*global appendToBox*/
var NodeRSA = require('node-rsa');
var helper = require('./../helper.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "unban") {
    if (helper.getData(line)) {
      user.socket.emit('unban', {userName:user.serverKey.encrypt(helper.getData(line))});
    }
    else {
      appendToBox("No user name provided  (/help to get help)",'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- unban : unban a user from the room (ex : /unban Toto)');
};
