var helper = require('./../controllers/helper.js');

exports.apply = function(line, user, callback) {
  if (!helper.getCommand(line)) {
    if(helper.getData(line))
    {
      user.socket.emit('sendMessage', {message:user.serverKey.encrypt(helper.getData(line))});
    }
  }
  else {
    callback();
  }
};
