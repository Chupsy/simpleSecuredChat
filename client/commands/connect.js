var helper = require('./../controllers/helper.js');
var socketCommandList = require('./../config.json')["socketCommandList"];
var screenCommands = require('./../screen/commands.js');
exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) != "connect" && (!user.socket || !user.socket.isValid)) {
    screenCommands.appendToBox('> '+line);
    screenCommands.appendToBox("Please connect to server first using /connect serverIPAddress (/help to get help)", 'red');
  }
  else if (helper.getCommand(line) === "connect") {
    if (helper.getData(line)) {
      if(user.socket){
        user.socket.disconnect();
        user.socket = null;
      }
      user.socket = require('socket.io-client')('http://' + helper.getData(line), {'force new connection': true});
      for(var i = 0; i<socketCommandList.length; i++){
        require('./socketCommands/'+socketCommandList[i]+'.js').apply(user);
      }
      screenCommands.appendToBox("connecting to server "+ helper.getData(line) +"...", 'yellow');
    }
    else {
      screenCommands.appendToBox(">" + line);
      screenCommands.appendToBox("No server url provided  (/help to get help)", 'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- connect : Connect user to chat server, you have to specify url after connect (ex : /connect 127.0.0.1:8080)');
};

