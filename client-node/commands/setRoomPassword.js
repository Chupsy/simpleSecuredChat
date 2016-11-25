var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "setRoomPassword") {
    screenCommands.appendToBox(">" + line);
    if (helper.getData(line)) {
      user.socket.emit('setRoomPassword', {password:user.serverKey.encrypt(helper.getData(line))});
    }
    else {
      screenCommands.appendToBox("No password provided  (/help to get help)",'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- setRoomPassword : Set a password in order to enter room (ex : /setRoomPassword pwd123)');
};
