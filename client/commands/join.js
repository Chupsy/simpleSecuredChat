/*global appendToBox*/
var helper = require('./../helper.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "join") {
    if (helper.getData(line)) {
      user.socket.emit('join', {id:user.serverKey.encrypt(helper.getData(line))});
    }
    else {
      appendToBox("No room name provided  (/help to get help)",'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- join : Allow user to join the room, user must provide room name (ex : /join room of the doom)');
};