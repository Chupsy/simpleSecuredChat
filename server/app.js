var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var NodeRSA = require('node-rsa');
var sockets = require('./server_modules/sockets.js').list;
var config = require('./config.json');
var commandList = {};
var commands = require('./commands.json');
for(var i = 0; i<commands.length; i++){
  var c = commands[i];
  commandList[c] = require('./server_modules/commands/'+c+'.js');
}

global.key = new NodeRSA({b: config.RSA});

setInterval(function(){
  global.key = new NodeRSA({b: 512});
  io.sockets.emit('updateRSA', {  key: global.key.exportKey('public') });
}, 10000);


io.on('connection', function (socket) {
  socket.name = "anonymous"+Math.floor((Math.random() * 9999) + 1);
  sockets[socket.id] = socket;
  socket.emit('rsa', { key: global.key.exportKey('public') });
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
  for(var command in commandList){
    if(commandList.hasOwnProperty(command)){
      commandList[command].process(socket);
    }
  }
});

server.listen(config.port);