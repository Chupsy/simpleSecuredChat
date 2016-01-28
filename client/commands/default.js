
/*global appendToBox*/
var helper = require('./../helper.js');

exports.apply = function(line, user, callback) {
  if (helper.getCommand(line) != null) {
    appendToBox('command unknown  (/help to get help)');
  }
  else {
    callback();
  }
};
