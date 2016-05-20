var player = require('play-sound')(opts = {});
var screenCommands = require('./../../screen/commands.js');

var playNotif = function(){
  player.play('sounds/notif.mp3', function(err){
  });
};
exports.apply = function(user){
  user.socket.on('message', function (data) {
    var str = user.rsa.decrypt(data.message, 'utf8');
    var color = null;
    if (data.userName) {
      if(!user.muted){
        playNotif();
      }
      str = user.rsa.decrypt(data.userName, 'utf8') + ': ' + str;
    }
    else {
      if (data.isWhisper){
          color = 'blue';
        }
      else{
        color = data.color ?data.color: 'green';
      }
    }

    screenCommands.appendToBox(str, color);
    if(data.room){
      screenCommands.clearUserScreen();
      screenCommands.setOnUserScreen('ROOM : ' + user.rsa.decrypt(data.room, 'utf8'));
      for(u in data.users){
        var username = data.users[u].admin?'*':'';

        username += user.rsa.decrypt(data.users[u].name, 'utf8');
        screenCommands.setOnUserScreen( username);
      }
    }
    else if(data.noRoom){
      screenCommands.clearUserScreen();
      screenCommands.setOnUserScreen('NO ROOM');
    }
  });

};