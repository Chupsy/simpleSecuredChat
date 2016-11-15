var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "join") {
    screenCommands.appendToBox(">" + line);
    if (helper.getData(line) && helper.getDataWithParams(helper.getData(line)).data) {
      var parsedLine = helper.getDataWithParams(helper.getData(line));
      var dataToSend = {
        id:user.serverKey.encrypt(parsedLine.data)
      };
      // if(parsedLine.p){
      //   dataToSend.password = user.serverKey.encrypt(parsedLine.p);
      // }
      user.socket.emit('join', dataToSend);
    }
    else {
      screenCommands.appendToBox("No room name provided  (/help to get help)",'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- join : Allow user to join the room, user must provide room name (ex : /join room of the doom)');
};