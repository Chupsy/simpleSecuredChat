/*global appendToBox*/
exports.apply = function(user){
  user.socket.on('newUserName', function (data) {
    if (data.name) {
      appendToBox('new user name : ' + user.rsa.decrypt(data.name, 'utf8'), 'green');
    }
  });
};