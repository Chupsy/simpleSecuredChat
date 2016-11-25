var player = require('play-sound')(opts = {});
var screenCommands = require('./../../screen/commands.js');

var playWizz = function(){
  player.play('sounds/wizz.mp3', function(err){
  });
};
exports.apply = function(user) {
  user.socket.on('wizz', function (data) {
    if(!user.muted){
      playWizz();
    }
    var str = user.rsa.decrypt(data.userName, 'utf8') + ' just wizzed you';
    screenCommands.appendToBox(str, 'yellow');
    screenCommands.wizz();
  });
};
