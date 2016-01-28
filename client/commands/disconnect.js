/*global appendToBox*/
var helper = require('./../helper.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "disconnect") {
    user.socket.disconnect();
    appendToBox('disconnected', 'red');
    clearUserScreen();
    setOnUserScreen('disconnected');
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- disconnect : Disconnect user from server');
};