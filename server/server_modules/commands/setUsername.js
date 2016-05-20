var sockets = require('../sockets.js').list;
var socketModule = require('../sockets.js');
var rsa = require('./rsa.js');

exports.process = function(socket){
  socket.on('setUsername', function(data){
    rsa.check(socket, function(){
      var newName = key.decrypt(data.name, 'utf8');
      if(socketModule.isNameAvailable(newName)){
        var oldName = socket.name;
        socket.name = newName;

        if(socket.room){
          socketModule.sendMessageToRoom(socket.room,oldName + ' is now known as ' + socket.name, null);
        }
        else{
          socket.emit('newUserName', {
            name : socket.rsa.encrypt(socket.name)
          });
        }
      }
      else{
        socket.emit('message', {message : socket.rsa.encrypt(newName + ' is already in use')});
      }
    });
  });
};
