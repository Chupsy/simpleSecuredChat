/*global appendToBox*/
var helper = require('./../helper.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) === "timelog") {
    user.timelogEnabled = !user.timelogEnabled;
    if(user.timelogEnabled){
      appendToBox('timelog enabled','green');
    }
    else{
      appendToBox('timelog disabled','green');
    }
  }
  else {
    callback();
  }
};

exports.help = function(){
  return('- timelog : Allow user to enable/disable log of time before any message');
};