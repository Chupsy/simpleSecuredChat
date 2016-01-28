var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var uuid = require('node-uuid');
var NodeRSA = require('node-rsa');
//var database = require('./server_modules/database.js');
var key = new NodeRSA({b: 512});
var sockets = {};
var rooms = {};
//database.connect();

function isNameAvailable(str) {
  for(var s in sockets){
    if(sockets[s].name === str.trim())
    return false;
  }
  return true;
}
io.on('connection', function (socket) {
  socket.name = "anonymous"+Math.floor((Math.random() * 9999) + 1);
  sockets[socket.id] = socket;
  socket.emit('rsa', { key: key.exportKey('public') });
  socket.on('setRSA', function(data){
    socket.rsa= null;
    if(data.rsa)
    {
      socket.tmprsa = new NodeRSA(key.decrypt(data.rsa, 'utf8'));
      socket.validateKey = uuid.v4();
      socket.emit('validateRSA', {key : socket.tmprsa.encrypt(socket.validateKey)});
    }
    else
    {
      socket.emit('errorAuth',{message : 'no RSA set', forceDisconnect:true});
      sockets[socket.id] = null;
    }
  });

  socket.on('validateRSA', function(data){
    if(socket.tmprsa && socket.validateKey && data.validateKey &&
      socket.validateKey == key.decrypt(data.validateKey, 'utf8'))
    {
      socket.rsa = socket.tmprsa;
      socket.tmprsa = null;
      socket.emit('validateSuccess',{
        name : socket.rsa.encrypt(socket.name)
      });
    }
    else
    {
      socket.emit('errorAuth', {message : 'RSA validation failed', forceDisconnect:true});
      sockets[socket.id] = null;
    }
  });

  socket.on('setUsername', function(data){
    if(socket.rsa)
    {
      var newName = key.decrypt(data.name, 'utf8');
      if(isNameAvailable(key.decrypt(data.name, 'utf8'))){
        var oldName = socket.name;
        socket.name = newName;

        if(socket.room){
          sendMessageToRoom(socket.room,oldName + ' is now known as ' + socket.name, null);
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
    }
    else
    {
      socket.emit('errorAuth',{message : 'no RSA set', forceDisconnect:true});
      sockets[socket.id] = null;
    }
  });

  socket.on('join', function (data) {
    if(socket.rsa)
    {
      if(socket.room){
        sendMessageToRoom(socket.room,socket.name + ' has left the room', null, socket.id);
      }
      var roomId = key.decrypt(data.id, 'utf8');
      if(!rooms[roomId]){
        rooms[roomId] = {
          users : {},
          admins : {},
          bans : {}
        };
        rooms[roomId].admins[socket.id] = true;
      }
      if(rooms[roomId].bans[socket.id]){
        socket.emit('message', {noRoom:true,message : socket.rsa.encrypt('You are banned from the room ' + roomId)});
      }
      else{
        rooms[roomId].users[socket.id] = socket;
        socket.room = roomId;

        var dataToSend = {};
        dataToSend.room = rooms[roomId].users[socket.id].rsa.encrypt(roomId);
        dataToSend.users = [];
        for(var u in rooms[roomId].users){
          if(rooms[roomId].users[u])
            dataToSend.users.push({admin:rooms[roomId].admins[u]?true:false,name :rooms[roomId].users[socket.id].rsa.encrypt(rooms[roomId].users[u].name) });
        }
        dataToSend.message = socket.rsa.encrypt('You have joined the room ' + socket.room);
        socket.emit('message', dataToSend);

        sendMessageToRoom(socket.room,socket.name + ' has joined the room', null, socket.id);
        if(rooms[roomId].admins[socket.id]){
          sendMessageToRoom(socket.room,socket.name + ' is now admin of the room', null, socket.id);
          socket.emit('message', {message : socket.rsa.encrypt('You are now admin of the room ' + socket.room)});
        }
      }
    }
    else
    {
      socket.emit('errorAuth',{message : 'no RSA set', forceDisconnect:true});
      sockets[socket.id] = null;
    }
  });
  socket.on('setAdmin', function (data) {
    if(socket.rsa)
    {
      if(socket.room){
        if(rooms[socket.room].admins[socket.id]){
          if(!data.userName){
            socket.emit('errorAuth',{message : 'No user provided', forceDisconnect:false});
          }
          else{
            var userName = key.decrypt(data.userName, 'utf8');

            var userExist = false;
            var userToAdd = null;
            for(var s in rooms[socket.room].users){
              if(rooms[socket.room].users[s].name == userName){
                userExist = true;
                userToAdd = rooms[socket.room].users[s];
              }
            }
            if(userExist){
              if(!rooms[socket.room].admins[userToAdd.id]){
                rooms[socket.room].admins[userToAdd.id] = true;
                sendMessageToRoom(socket.room, userToAdd.name + " is now admin of the channel");
              }
              else{
                socket.emit('errorAuth',{message : 'User ' + userName + ' is already an admin', forceDisconnect:false});
              }
            }
            else{
              socket.emit('errorAuth',{message : 'User ' + userName + ' does not exist', forceDisconnect:false});
            }
          }
        }
        else{
          socket.emit('errorAuth',{message : 'You are not admin of the channel', forceDisconnect:false});
        }
      }
      else{
        socket.emit('errorAuth',{message : 'You have no room', forceDisconnect:false});
      }
    }
    else
    {
      socket.emit('errorAuth',{message : 'no RSA set', forceDisconnect:true});
      sockets[socket.id] = null;
    }
  });
  socket.on('kick', function (data) {
    if(socket.rsa)
    {
      if(socket.room){
        if(rooms[socket.room].admins[socket.id]){
          if(!data.userName){
            socket.emit('errorAuth',{message : 'No user provided', forceDisconnect:false});
          }
          else{
            var userName = key.decrypt(data.userName, 'utf8');

            var userExist = false;
            var userToRemove = null;
            for(var s in rooms[socket.room].users){
              if(rooms[socket.room].users[s].name == userName){
                userExist = true;
                userToRemove = rooms[socket.room].users[s];
              }
            }
            if(userExist){
              var room = socket.room;
              rooms[socket.room].admins[userToRemove.id] = null;
              rooms[socket.room].users[userToRemove.id] = null;
              userToRemove.room = null;
                sendMessageToRoom(room, userToRemove.name + " was kicked from the channel", null);
              userToRemove.emit('message', {noRoom:true,message : userToRemove.rsa.encrypt('You were kicked from channel by ' + socket.name)});

            }
            else{
              socket.emit('errorAuth',{message : 'User ' + userName + ' does not exist', forceDisconnect:false});
            }
          }
        }
        else{
          socket.emit('errorAuth',{message : 'You are not admin of the channel', forceDisconnect:false});
        }
      }
      else{
        socket.emit('errorAuth',{message : 'You have no room', forceDisconnect:false});
      }
    }
    else
    {
      socket.emit('errorAuth',{message : 'no RSA set', forceDisconnect:true});
      sockets[socket.id] = null;
    }
  });
  socket.on('ban', function (data) {
    if(socket.rsa)
    {
      if(socket.room){
        if(rooms[socket.room].admins[socket.id]){
          if(!data.userName){
            socket.emit('errorAuth',{message : 'No user provided', forceDisconnect:false});
          }
          else{
            var userName = key.decrypt(data.userName, 'utf8');

            var userExist = false;
            var userToRemove = null;
            for(var s in rooms[socket.room].users){
              if(rooms[socket.room].users[s].name == userName){
                userExist = true;
                userToRemove = rooms[socket.room].users[s];
              }
            }
            if(userExist){
              var room = socket.room;
              userToRemove.emit('message', {noRoom:true,message : userToRemove.rsa.encrypt('You were banned from channel' + socket.room+' by ' + socket.name)});
              if(userToRemove.id == socket.id){
                sendMessageToRoom(room, userToRemove.name + " was banned from the channel " + socket.room, socket.id);
                rooms[socket.room].admins[userToRemove.id] = null;
                rooms[socket.room].users[userToRemove.id] = null;
                rooms[socket.room].bans[userToRemove.id] = true;
                userToRemove.room = null;
              }
              else{
                rooms[socket.room].admins[userToRemove.id] = null;
                rooms[socket.room].users[userToRemove.id] = null;
                rooms[socket.room].bans[userToRemove.id] = true;
                userToRemove.room = null;
                sendMessageToRoom(room, userToRemove.name + " was banned from the channel " + socket.room);
              }

            }
            else{
              socket.emit('errorAuth',{message : 'User ' + userName + ' does not exist', forceDisconnect:false});
            }
          }
        }
        else{
          socket.emit('errorAuth',{message : 'You are not admin of the channel', forceDisconnect:false});
        }
      }
      else{
        socket.emit('errorAuth',{message : 'You have no room', forceDisconnect:false});
      }
    }
    else
    {
      socket.emit('errorAuth',{message : 'no RSA set', forceDisconnect:true});
      sockets[socket.id] = null;
    }
  });

  socket.on('unban', function (data) {
    if(socket.rsa)
    {
      if(socket.room){
        if(rooms[socket.room].admins[socket.id]){
          if(!data.userName){
            socket.emit('errorAuth',{message : 'No user provided', forceDisconnect:false});
          }
          else{
            var userName = key.decrypt(data.userName, 'utf8');

            var userExist = false;
            var userToRemove = null;
            for(var s in sockets){
              if(sockets[s].name == userName){
                userExist = true;
                userToRemove = sockets[s];
              }
            }
            if(userExist){
              var room = socket.room;
              if(userToRemove && rooms[socket.room].bans[userToRemove.id]){
                rooms[socket.room].bans[userToRemove.id] = null;
                sendMessageToRoom(room, userToRemove.name + " was unbanned from the channel " + socket.room, null);
                userToRemove.emit('message', {noRoom:true,message : userToRemove.rsa.encrypt('You were unbanned from channel ' + socket.room+' by ' + socket.name)});
              }
              else{
                socket.emit('errorAuth',{message : 'User ' + userName + ' is not banned', forceDisconnect:false});
              }
            }
            else{
              socket.emit('errorAuth',{message : 'User ' + userName + ' does not exist', forceDisconnect:false});
            }
          }
        }
        else{
          socket.emit('errorAuth',{message : 'You are not admin of the channel', forceDisconnect:false});
        }
      }
      else{
        socket.emit('errorAuth',{message : 'You have no room', forceDisconnect:false});
      }
    }
    else
    {
      socket.emit('errorAuth',{message : 'no RSA set', forceDisconnect:true});
      sockets[socket.id] = null;
    }
  });

  socket.on('whisper', function (data) {
    if(socket.rsa)
    {
      if(data.userName && data.message){
        var message = key.decrypt(data.message, 'utf8');
        var userName = key.decrypt(data.userName, 'utf8');
        var socketToSendTo = null;
        for(var s in sockets){
          if(sockets[s].name == userName){
            socketToSendTo = sockets[s];
          }
        }
        if(socketToSendTo){
          if(socketToSendTo.id == socket.id){
            socket.emit('errorAuth',{message : 'you cannot send private messages to yourself', forceDisconnect:false});
          }
          else{
            var dataToSend = {
              userName : socketToSendTo.rsa.encrypt('from ' + socket.name),
              message : socketToSendTo.rsa.encrypt(message),
              isWhisper : true
            };
            socketToSendTo.emit('message', dataToSend);
            var dataToSendToLocal = {
              userName : socket.rsa.encrypt('to ' + userName),
              message : socket.rsa.encrypt(message),
              isWhisper : true
            };
            socket.emit('message', dataToSendToLocal);
          }
        }
        else{
          socket.emit('errorAuth',{message : 'User ' + userName + ' does not exist', forceDisconnect:false});
        }
      }
      else
      {
        socket.emit('errorAuth',{message : 'No name or message available', forceDisconnect:false});
      }

    }
    else
    {
      socket.emit('errorAuth',{message : 'no RSA set', forceDisconnect:true});
      sockets[socket.id] = null;
    }
  });


  socket.on('sendMessage', function (data) {
    if(socket.rsa)
    {
      if(socket.room){
        var message = key.decrypt(data.message, 'utf8');
        var isAdmin = rooms[socket.room].admins[socket.id]?true:false;
        sendMessageToRoom(socket.room, message, socket.name, null, isAdmin);
      }
      else{
        socket.emit('errorAuth',{message : 'You have no room', forceDisconnect:false});
      }
    }
    else
    {
      socket.emit('errorAuth',{message : 'no RSA set', forceDisconnect:true});
      sockets[socket.id] = null;
    }
  });
  socket.on('disconnect', function(){
    if(socket.room){
      sendMessageToRoom(socket.room,socket.name + ' has left the room', null, socket.id);
      if(rooms[socket.room].admins[socket.id]){
        sendMessageToRoom(socket.room,socket.name + ' is no longer admin of the channel', null);
      }
      rooms[socket.room].users[socket.id] = null;
      if(Object.keys(rooms[socket.room].users).length==0){
        delete rooms[socket.room];
      }
    }
  });
});

function sendMessageToRoom(room,message, name, except, isAdmin){
  for(var s in rooms[room].users)
  {
    if( rooms[room].users.hasOwnProperty(s) && rooms[room].users[s] != null && rooms[room].users[s].rsa && (!except || (except && s != except)))
    {
      var dataToSend = {};
      if(name ){
        if(isAdmin){
          dataToSend.userName = '[' + name + ']';
        }
        else{
          dataToSend.userName = name;
        }
        dataToSend.userName = rooms[room].users[s].rsa.encrypt(dataToSend.userName);
      }
      dataToSend.room = rooms[room].users[s].rsa.encrypt(room);
      dataToSend.users = [];
      for(var u in rooms[room].users){
        if(rooms[room].users[u])
          dataToSend.users.push({admin:rooms[room].admins[u]?true:false,name :rooms[room].users[s].rsa.encrypt(rooms[room].users[u].name) });
      }
      dataToSend.message = rooms[room].users[s].rsa.encrypt(message);
      rooms[room].users[s].emit('message', dataToSend);
    }
  }
}
server.listen(8080);