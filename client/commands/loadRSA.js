/*global appendToBox*/
var NodeRSA = require('node-rsa');
var util = require('util');
var fs = require('fs');
var helper = require('./../helper.js');

exports.apply = function(line,user, callback){
  if(helper.getCommand(line)!="loadRSA" && !user.rsa){
    appendToBox(">" + line);
    appendToBox("You did not load your RSA key! (/help to get help)");
  }
  else if(helper.getCommand(line) === "loadRSA"){
    if(user.socket && user.socket.isValid)user.socket.disconnect();
    if(helper.getData(line)){
      fs.readFile(helper.getData(line),'utf8', function (err, userKey) {
        if (err){
          appendToBox(">" + line);
          appendToBox('error while loading key : ' + err.toString() ,'red');
        }
        else
        {
          if(!user.rsa) user.rsa = {};
          user.rsa = new NodeRSA(userKey);
          appendToBox(">" + line);
          appendToBox("RSA key loaded",'green');
        }
      });
    }
    else{
      if(!user.rsa) user.rsa = {};
      user.rsa = new NodeRSA({b: 512});
      appendToBox(">" + line);
      appendToBox("RSA key created",'green');
    }
  }
  else{
    callback();
  }
};
exports.help = function(){
  return('- loadRSA : Allow user to load his RSA key. User must provide private key file path on the machine. If no path is provided, a RSA key will be generated for your session. (example : /loadRSA /Users/John/keys/privateKey.ppk)');
};