var screenCommands = require('./../../screen/commands.js');
exports.apply = function(user){
  user.socket.on('newUserName', function (data) {
    if (data.name) {
      screenCommands.appendToBox('new user name : ' + user.rsa.decrypt(data.name, 'utf8'), 'green');
    }
  });
};