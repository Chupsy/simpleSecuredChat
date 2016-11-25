var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "disconnect") {
    screenCommands.appendToBox(">" + line);
    user.socket.disconnect();
    user.socket = null;
    screenCommands.appendToBox('disconnected', 'red');
    screenCommands.clearUserScreen();
    screenCommands.setOnUserScreen('disconnected');
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- disconnect : Disconnect user from server');
};