var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var NodeRSA = require('node-rsa');
var sockets = require('./server_modules/sockets.js').list;
var config = require('./config.json');
var commandList = require('./commands.json')['commandList'];
var commandProcessor = require('./server_modules/commands');

global.key = new NodeRSA({b: config.RSA});

setInterval(function () {
  global.key = new NodeRSA({b: 512});
  io.sockets.emit('updateRSA', {key: global.key.exportKey('public')});
}, 10000);

io.on('connection', function (socket) {
  socket.name = "anonymous" + Math.floor((Math.random() * 9999) + 1);
  sockets[socket.id] = socket;
  socket.emit('rsa', {key: global.key.exportKey('public')});
  commandList
    .map(function(command){
      commandProcessor(command, socket);
    });
});
server.listen(config.port);
