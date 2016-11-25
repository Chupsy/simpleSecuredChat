var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "ban") {
    screenCommands.appendToBox(">" + line);
    if (helper.getData(line)) {
      user.socket.emit('ban', {userName:user.serverKey.encrypt(helper.getData(line))});
    }
    else {
      screenCommands.appendToBox("No user name provided  (/help to get help)", 'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- ban : ban a user from the room (ex : /ban Toto)');
};
