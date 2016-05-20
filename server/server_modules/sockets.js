var rooms = require('./rooms.js');
var sockets = {};

module.exports.list = sockets;

module.exports.isNameAvailable = function(name){
  for(var s in sockets){
    if(sockets.hasOwnProperty(s) && sockets[s] && sockets[s].name === name.trim()){
      return false
    }
  }
  return true;
};

module.exports.sendMessageToRoom = function(roomId,message, name, except, isAdmin) {
  var room = rooms.getRoom(roomId);
  for(var s = 0; s<room.users.length; s++)
  {
    if(room.users[s] && sockets[room.users[s]] && sockets[room.users[s]].rsa && (!except || (except && room.users[s] != except))){
      var dataToSend = {};
      if(name){
        dataToSend.userName = sockets[room.users[s]].rsa.encrypt(isAdmin? '[' + name + ']' : name);
      }
      dataToSend.room = sockets[room.users[s]].rsa.encrypt(room.name);
      dataToSend.users = [];
      for(var u in room.users){
        if(room.users[u])
          dataToSend.users.push({admin:room.isAdmin(room.users[u])?true:false,name :sockets[room.users[s]].rsa.encrypt(sockets[room.users[u]].name) });
      }
      dataToSend.message = sockets[room.users[s]].rsa.encrypt(message);
      sockets[room.users[s]].emit('message', dataToSend);
    }
  }
};

module.exports.getSocketFromUsername = function(userName){
  for(var s in sockets){
    if(sockets.hasOwnProperty(s) && sockets[s] && sockets[s].name === userName.trim()){
      return sockets[s];
    }
  }
  return null;
};

module.exports.removeSocket = function(s){
  sockets[s] = null;
};
