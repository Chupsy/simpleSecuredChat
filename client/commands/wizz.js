var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "wizz") {
    if (helper.getData(line)) {
        var username = helper.getData(line);
          user.socket.emit('wizz', {userName:user.serverKey.encrypt(username)});
    }
    else {
      screenCommands.appendToBox("No user name provided (/help to get help)",'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- whisper / w : send a wizz to the user (ex : /wizz Toto)');
};
