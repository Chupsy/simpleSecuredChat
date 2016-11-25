var screenCommands = require('./../../screen/screen.js');

exports.apply = function(user){
  user.socket.on('passwordRequested', function (data) {
    var id = user.rsa.decrypt(data.roomId, 'utf8');
    screenCommands.promptPassword(function(pwd){
      var dataToSend = {
        id:user.serverKey.encrypt(id),
        password:user.serverKey.encrypt(pwd)
      };
      user.socket.emit('join', dataToSend);
    });
  });

};