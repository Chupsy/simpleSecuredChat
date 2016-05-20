var config = require('./../config.json');
var moment = require('moment');
var blessed = require('./screen.js');
var input = blessed.input;
var screen = blessed.screen;
var box = blessed.box;
var box2 = blessed.box2;
var currentLine = 0;
var lineHistory = [];
var currentLineHistory = -1;
var baseValue = '';
var user = {};
var commands = require('./../controllers/commands.js');

input.key('up', function(ch, key){
  if(currentLineHistory==-1){
    baseValue = this.getValue();
  }
  if(currentLineHistory+1<lineHistory.length){
    currentLineHistory++;
    this.setValue(lineHistory[currentLineHistory]);
    screen.render();
  }
});
input.key('down', function(ch, key){
  if(currentLineHistory>=0){
    currentLineHistory--;
    if(currentLineHistory==-1){
      this.setValue(baseValue?baseValue:'');
    }
    else{
      this.setValue(lineHistory[currentLineHistory]);
    }
  }
  screen.render();
});
input.key('C-c', function(ch, key){
  currentLineHistory = -1;
  baseValue='';
  this.setValue('');
  screen.render();
  input.focus();
});

input.key('enter', function(ch, key) {
  var line = this.getValue();
  lineHistory.unshift(line);
  if(line.length>30){
    lineHistory.pop();
  }
  commands.readLine(line, user);
  this.clearValue();
  screen.render();
  input.focus();
  currentLineHistory = -1;
  baseValue = '';
});

module.exports.user = user;

module.exports.appendToBox = function(str, color){
  if(user.timelogEnabled && str.length>0){
    str = moment().format("(HH:mm:ss) ")+str;
  }
  if(color){
    str = '{'+color+'-fg}' + str + '{/}'
  }
  if(currentLine>config.maxLine){
    box.deleteTop();
  }
  box.insertBottom(str);
  currentLine++;
  screen.render();
};

module.exports.setOnUserScreen = function(str){
  box2.insertBottom(str);
  screen.render();
};

module.exports.clearUserScreen = function(){
  box2.setContent('');
  screen.render();
  module.exports.updateKeyTime();
};

module.exports.updateKeyTime = function(){
  if(user.keyUpdated){
    box2.deleteTop();
    box2.insertTop('{yellow-fg}' + user.keyUpdated + '{/}');
  }
};


module.exports.wizz  = function(){
  function white(cb){
    box.style.bg = 'white';
    box2.style.bg = 'white';
    input.style.bg = 'white';
    screen.render();

    setTimeout(function(){
      cb();
    }, 70);
  }
  function standart(cb){
    box.style.bg = 'black';
    box2.style.bg = 'black';
    input.style.bg = 'black';
    screen.render();
    setTimeout(function(){
      cb()
    }, 70);
  }
  white(function(){
    standart(function(){
      white(function(){
        standart(function(){
          white(function(){
            standart(function(){
            })
          })
        })
      })
    });
  });
};
