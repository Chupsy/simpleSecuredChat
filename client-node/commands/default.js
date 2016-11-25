var helper = require('./../controllers/helper.js');
var screenCommands = require('./../screen/commands.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) != null) {
    screenCommands.appendToBox(">" + line);
    screenCommands.appendToBox('command unknown  (/help to get help)');
  }
  else {
    callback();
  }
};
