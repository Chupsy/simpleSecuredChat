var config = require('./config.json');
var commandList = {};

for(var i = 0; i<config["commandList"].length; i++)
{
  commandList[i] = require('./commands/'+config["commandList"][i]+'.js');
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