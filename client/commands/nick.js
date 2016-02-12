/*global appendToBox*/
var helper = require('./../helper.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "nick") {
    if (helper.getData(line)) {
      user.socket.emit('setUsername', {name:user.serverKey.encrypt(helper.getData(line))});
    }
    else {
      appendToBox("No name provided  (/help to get help)",'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- nick : Set your nick name in the room (ex : /nick Toto)');
};
