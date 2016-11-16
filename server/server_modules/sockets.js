var rooms = require('./rooms.js');
var sockets = {};

module.exports.list = sockets;

module.exports.isNameAvailable = function(name){
  name = name.trim();
  return !Object.keys(sockets).map(s=>sockets[s].name==name)
    .reduce((a,b)=> a || b);
};

module.exports.sendMessageToRoom = function(roomId,message, name, except, isAdmin) {
  var room = rooms.getRoom(roomId);
  room.users.map(function(user){
    if(user && sockets[user] && sockets[user].rsa && user != except){
      var dataToSend = {};
      if(name){
        dataToSend.userName = sockets[user].rsa.encrypt(isAdmin? '[' + name + ']' : name);
      }
      dataToSend.room = sockets[user].rsa.encrypt(room.name);
      dataToSend.users = room.users.map(function(roomUser){
        return {admin:room.isAdmin(roomUser),name :sockets[user].rsa.encrypt(sockets[roomUser].name) }
      });
      dataToSend.message = sockets[user].rsa.encrypt(message);
      sockets[user].emit('message', dataToSend);
    }
  });
};

module.exports.getSocketFromUsername = function(name){
  name = name.trim();
  return Object.keys(sockets).map(s=>sockets[s].name==name?sockets[s] : null)
    .reduce((a,b)=>a?a:b);
};

module.exports.removeSocket = function(s){
  delete sockets[s];
};
