var helper = require('./../controllers/helper.js');
var commandList = require('./../config.json')["commandList"];
var command;
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "help") {
    if (helper.getData(line)) {
      if(commandList.indexOf(helper.getData(line))>-1){
        command = require('./'+commandList[commandList.indexOf(helper.getData(line))]+'.js');
        if(command.hasOwnProperty('help')){
          screenCommands.appendToBox(require('./'+commandList[commandList.indexOf(helper.getData(line))]+'.js').help());
        }
        else screenCommands.appendToBox('Command ' + helper.getData(line) + ' does not exist (yet)','red');
      }
      else{
        screenCommands.appendToBox('Command ' + helper.getData(line) + ' does not exist (yet)','red');
      }
      screenCommands.appendToBox('');
    }
    else {
      for(var c = 0; c<commandList.length; c++){
        command = require('./'+commandList[c]+'.js');
        if(command.hasOwnProperty('help')) {
          screenCommands.appendToBox(command.help());
          screenCommands.appendToBox('');
        }
      }
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- help : List of all the commands descriptions, can be specified with a command name after help (ex : /help connect)');
};
