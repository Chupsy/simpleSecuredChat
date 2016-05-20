var NodeRSA = require('node-rsa');
var fs = require('fs');
var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line,user, callback){
  if(helper.getCommand(line)!="loadRSA" && !user.rsa){
    screenCommands.appendToBox(">" + line);
    screenCommands.appendToBox("You did not load your RSA key! (/help to get help)");
  }
  else if(helper.getCommand(line) === "loadRSA"){
    if(user.socket && user.socket.isValid){
      user.socket.disconnect();
      user.socket = null;
    }
    if(helper.getData(line)){
      fs.readFile(helper.getData(line),'utf8', function (err, userKey) {
        if (err){
          screenCommands.appendToBox(">" + line);
          screenCommands.appendToBox('error while loading key : ' + err.toString() ,'red');
        }
        else
        {
          if(!user.rsa) user.rsa = {};
          user.rsa = new NodeRSA(userKey);
          screenCommands.appendToBox(">" + line);
          screenCommands.appendToBox("RSA key loaded",'green');
        }
      });
    }
    else{
      if(!user.rsa) user.rsa = {};
      user.rsa = new NodeRSA({b: 512});
      screenCommands.appendToBox(">" + line);
      screenCommands.appendToBox("RSA key created",'green');
    }
  }
  else{
    callback();
  }
};
exports.help = function(){
  return('- loadRSA : Allow user to load his RSA key. User must provide private key file path on the machine. If no path is provided, a RSA key will be generated for your session. (example : /loadRSA /Users/John/keys/privateKey.ppk)');
};