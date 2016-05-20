var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "unban") {
    if (helper.getData(line)) {
      user.socket.emit('unban', {userName:user.serverKey.encrypt(helper.getData(line))});
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
  return('- unban : unban a user from the room (ex : /unban Toto)');
};
