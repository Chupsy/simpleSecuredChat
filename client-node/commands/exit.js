var helper = require('./../controllers/helper.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "exit") {
    process.exit(0);
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- exit : leaves app');
};