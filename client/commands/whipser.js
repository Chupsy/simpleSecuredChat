/*global appendToBox*/
var NodeRSA = require('node-rsa');
var helper = require('./../helper.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "whisper" || helper.getCommand(line) === "w") {
    if (helper.getData(line)) {
      if(line.indexOf(' ') > -1){
        var data = helper.getData(line);
        var username = data.substr(0, data.indexOf(' '));
        var message = data.substr(data.indexOf(' ')+1);
      }
      user.socket.emit('whisper', {userName:user.serverKey.encrypt(username), message : user.serverKey.encrypt(message)});
    }
    else {
      appendToBox("No user name and message provided (/help to get help)",'red');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- whisper / w : send a private message to the useer (ex : /w Toto Hello World! | /whisper Toto Hello World!)');
};
