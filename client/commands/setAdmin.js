var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "setAdmin") {
    if (helper.getData(line)) {
      user.socket.emit('setAdmin', {userName:user.serverKey.encrypt(helper.getData(line))});
    }
    else {
      screenCommands.appendToBox("No user name provided  (/help to get help)",'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- setAdmin : Set a user as admin in the room (ex : /setAdmin Toto)');
};
