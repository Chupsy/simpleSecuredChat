var Promise = require('bluebird');
var commandList = {};
var middlewares = {};

module.exports = function(command, socket){
  if(!commandList[command.name]){
    commandList[command.name] = require('./'+command.name + '.js');
  }
  socket.on(command.name, function(data){
    var requestData = {};
      Promise.mapSeries(command.middlewares, function(middleware){
        if(!middlewares[middleware]){
          middlewares[middleware] = require('./../middlewares/'+middleware + '.js');
        }
        return middlewares[middleware](socket, requestData);
      })
      .then(function(){
        commandList[command.name](socket,data, requestData);
      })
      .catch(function(e){
        socket.emit(e.name, {message: e.message, forceDisconnect: e.forceDisconnect});
      });
  });
};