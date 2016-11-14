var commands = require('./../commands.json');
var screenCommands = require('./../screen/commands.js');
var commandList = {};

for(var i = 0; i<commands["commandList"].length; i++)
{
  commandList[i] = require('./../commands/'+commands["commandList"][i]+'.js');
}

exports.readLine = function(line,user){
  line = line.trim();
  if(line.length > 0) {
    function callCommand(index){
      commandList[index].apply(line,user, function(err, data){
          index++;
          if(commandList[index]){
            callCommand(index);
          }
      });
    }
    callCommand(0);
  }

};