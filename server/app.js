var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var NodeRSA = require('node-rsa');
var sockets = require('./server_modules/sockets.js').list;
var config = require('./config.json');
var commandList = {};
for(var i = 0; i<config.commandList.length; i++){
  var c = config.commandList[i];
  commandList[c] = require('./server_modules/commands/'+c+'.js');
}

global.key = new NodeRSA({b: config.RSA});

setInterval(function(){
  global.key = new NodeRSA({b: config.RSA});
  io.sockets.emit('updateRSA', {  key: global.key.exportKey('public') });
}, 10000);


io.on('connection', function (socket) {
  socket.name = "anonymous"+Math.floor((Math.random() * 9999) + 1);
  sockets[socket.id] = socket;
  for(var command in commandList){
    if(commandList.hasOwnProperty(command)){
      commandList[command].process(socket);
    }
  }
});

server.listen(config.port);