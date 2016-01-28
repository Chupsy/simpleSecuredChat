/*global appendToBox*/
exports.apply = function(user){
  user.socket.on('message', function (data) {
    var str = user.rsa.decrypt(data.message, 'utf8');
    var color = null;
    if (data.userName) {
      str = user.rsa.decrypt(data.userName, 'utf8') + ': ' + str;
    }
    else {
      if (data.isWhisper){
          color = 'blue';
        }
      else{
        color = 'green';
      }
    }

    appendToBox(str, color);
    if(data.room){
      clearUserScreen();
      setOnUserScreen('ROOM : ' + user.rsa.decrypt(data.room, 'utf8'));
      for(u in data.users){
        var username = data.users[u].admin?'*':'';

        username += user.rsa.decrypt(data.users[u].name, 'utf8');
        setOnUserScreen( username);
      }
    }
    else if(data.noRoom){
      clearUserScreen();
      setOnUserScreen('NO ROOM');
    }
  });
};