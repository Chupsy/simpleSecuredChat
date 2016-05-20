var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "mute") {

    screenCommands.user.muted = !screenCommands.user.muted;
    if(screenCommands.user.muted){
      screenCommands.appendToBox('Application muted','green');
    }
    else{
      screenCommands.appendToBox('Application unmuted','green');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- mute : Allow user to mute application');
};