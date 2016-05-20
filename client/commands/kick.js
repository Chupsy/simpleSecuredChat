var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "kick") {
    if (helper.getData(line)) {
      user.socket.emit('kick', {userName:user.serverKey.encrypt(helper.getData(line))});
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
  return('- kick : kick a user from the room (ex : /kick Toto)');
};
