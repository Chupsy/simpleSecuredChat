var rooms = {};

module.exports.getRoom = getRoom;


function getRoom(id) {
  if (!rooms[id]) {
    rooms[id] = new Room(id);
  }
  return rooms[id];
};

function Room(name) {
  this.users = [];
  this.admins = [];
  this.bans = [];
  this.name = name;
  this.password = null;
}

Room.prototype.setPassword = function (password) {
  this.password = password;
  return Promise.resolve();
};

Room.prototype.hasPassword = function () {
  return this.password ? true : false;
};

Room.prototype.isBanned = function (socketId) {
  return this.bans.indexOf(socketId) > -1;
};

Room.prototype.isAdmin = function (socketId) {
  return this.admins.indexOf(socketId) > -1;
};

Room.prototype.isUser = function (socketId) {
  return this.users.indexOf(socketId) > -1;
};

Room.prototype.addUser = function (socketId) {
  var self = this;
  return new Promise(function(resolve,reject){
    if (self.isBanned(socketId)) {
      return reject({message: 'is banned from the room.'});
    }
    self.users.push(socketId);
    if (self.admins.length == 0) {
      return self.addAdmin(socketId)
        .then(function(){
          resolve();
        })
        .catch(function(err){
          reject(err);
        });
    }
    resolve();
  });

};

Room.prototype.addAdmin = function (socketId) {
  var self = this;
  return new Promise(function(resolve,reject){
    if (!self.isUser(socketId)) {
      return reject({message: 'is not part of the room.'});
    }
    if (self.isBanned(socketId)) {
      return reject({message: 'is banned from the room.'});
    }
    if (self.isAdmin(socketId)) {
      return reject({message: 'is already admin of the room.'});
    }
    self.admins.push(socketId);
    resolve();
  });

};

Room.prototype.addBan = function (socketId) {
  var self = this;
  return new Promise(function(resolve, reject){
    if (!self.isUser(socketId)) {
      return reject({message: 'is not part of the room.'});
    }
    if (self.isBanned(socketId)) {
      return reject({message: 'is already banned from the room.'});
    }
    self.bans.push(socketId);
    resolve();
  });
};

Room.prototype.removeBan = function (socketId) {
  var self = this;
  return new Promise(function(resolve, reject){
    if (!self.isBanned(socketId)) {
      return reject({message: 'is not banned.'});
    }
    self.bans.splice(self.bans.indexOf(socketId, 1));
    resolve();
  });
};

Room.prototype.removeUser = function (socketId) {
  var self = this;
  return new Promise(function(resolve, reject){
    if (!self.isUser(socketId)) {
      return reject({message: 'is not user of the room.'});
    }
    self.users.splice(self.users.indexOf(socketId), 1);
    if (self.isAdmin(socketId)) {
      return self.removeAdmin(socketId);
    }
    resolve();
  });
};

Room.prototype.removeAdmin = function (socketId) {
  var self = this;
  return new Promise(function(resolve,reject){
    if (!self.isAdmin(socketId)) {
      return reject({message: 'is not admin of the room.'});
    }
    self.admins.splice(self.admins.indexOf(socketId), 1);
    resolve();
  });
};