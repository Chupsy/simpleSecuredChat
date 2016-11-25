var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "timelog") {
    screenCommands.appendToBox(">" + line);
    screenCommands.user.timelogEnabled = !screenCommands.user.timelogEnabled;
    if(screenCommands.user.timelogEnabled){
      screenCommands.appendToBox('timelog enabled','green');
    }
    else{
      screenCommands.appendToBox('timelog disabled','green');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- timelog : Allow user to enable/disable log of time before any message');
};