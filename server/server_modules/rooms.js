var rooms = {};

module.exports.getRoom = getRoom;

module.exports.check= function(socket, cb){
  if(socket.room)
    return cb(getRoom(socket.room));
      socket.emit('errorAuth',{message : 'You have no room', forceDisconnect:false});
};

module.exports.checkAdminValidity = function(socket, cb){
  var room = getRoom(socket.room);
  if(room.isAdmin(socket.id))
    return cb();
  socket.emit('errorAuth',{message : 'You are not admin of the channel', forceDisconnect:false});
};

function getRoom(id){
  if(!rooms[id])
    rooms[id] = new Room(id);
  return rooms[id];
};

function Room(name){
  this.users = [];
  this.admins = [];
  this.bans = [];
  this.name = name;
}

Room.prototype.isBanned = function (socketId) {
  return this.bans.indexOf(socketId)>-1;
};

Room.prototype.isAdmin = function (socketId) {
  return this.admins.indexOf(socketId)>-1;
};

Room.prototype.isUser = function (socketId) {
  return this.users.indexOf(socketId)>-1;
};

Room.prototype.addUser = function(socketId, cb){
  if(this.isBanned(socketId)){
    return cb({message : 'is banned from the room.'});
  }
  this.users.push(socketId);
  if(this.admins.length == 0)
    return this.addAdmin(socketId, err => cb(err?err:null, err?null:true));
  cb();
};

Room.prototype.addAdmin = function(socketId, cb){
  if(!this.isUser(socketId)){
    return cb({message : 'is not part of the room.'});
  }
  if(this.isBanned(socketId)){
    return cb({message : 'is banned from the room.'});
  }
  if(this.isAdmin(socketId)){
    return cb({message : 'is already admin of the room.'});
  }
  this.admins.push(socketId);
  cb();
};

Room.prototype.addBan = function(socketId, cb){
  if(!this.isUser(socketId)){
    return cb({message : 'is not part of the room.'});
  }
  if(this.isBanned(socketId)){
    return cb({message : 'is already banned from the room.'});
  }
  this.bans.push(socketId);
  cb();
};

Room.prototype.removeBan = function(socketId, cb){
  if(!this.isBanned(socketId)){
    return cb({message : 'is not banned.'});
  }
  this.bans.splice(this.bans.indexOf(socketId, 1));
  cb();
};

Room.prototype.removeUser = function(socketId, cb){
  if(!this.isUser(socketId)){
    return cb({message : 'is not user of the room.'});
  }
  this.users.splice(this.users.indexOf(socketId),1);
  if(this.isAdmin(socketId)){
    return this.removeAdmin(socketId, cb);
  }
  return cb();
};

Room.prototype.removeAdmin = function(socketId, cb){
  if(!this.isAdmin(socketId)){
    return cb({message : 'is not admin of the room.'});
  }
  this.admins.splice(this.admins.indexOf(socketId),1);
  return cb();
};