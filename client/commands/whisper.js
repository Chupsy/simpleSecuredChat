var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "whisper" || helper.getCommand(line) === "w") {
    if (helper.getData(line) && line.indexOf(' ') > -1) {
        var data = helper.getData(line);
        var username = "";
        var message = "";
        if(data.indexOf(' ') > -1){
          username = data.substr(0, data.indexOf(' '));
          message = data.substr(data.indexOf(' ')+1);
          user.socket.emit('whisper', {userName:user.serverKey.encrypt(username), message : user.serverKey.encrypt(message)});
        }
      else{
          screenCommands.appendToBox("Missing parameters (name or message) (/help to get help)",'red');
        }
    }
    else {
      screenCommands.appendToBox("No user name and message provided (/help to get help)",'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- whisper / w : send a private message to the user (ex : /w Toto Hello World! | /whisper Toto Hello World!)');
};
