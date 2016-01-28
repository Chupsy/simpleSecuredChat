var config = require('./config.json');
var moment = require('moment');
var commands = require('./commands.js');
var user = {};
var blessed = require('blessed');
var lineHistory = [];
var currentLineHistory = -1;
var baseValue = '';

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});
var currentLine = 0;

screen.title = 'securedChat 1.0';

var box = blessed.box({
  width: '80%',
  height: '100%',
  content: 'Welcome !',
  left:0,
  tags: true,
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});
var box2 = blessed.box({
  width: '20%',
  height: '100%',
  content: 'Disconnected',
  right:0,
  tags: true,
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});

// Append our box to the screen.
screen.append(box);
screen.append(box2);

var input = blessed.textbox({
  bottom: 0,
  height: 3,
  inputOnFocus: true,
  padding: {
    top: 1,
    left: 2
  },
  style: {
    fg: '#787878',
    bg: '#454545',

    focus: {
      fg: '#f6f6f6',
      bg: '#353535'
    }
  }
});

// Append the widget to the screen.
screen.append(input);
input.focus();

// Quit on `q`, or `Control-C` when the focus is on the screen.
screen.key(['q', 'C-c'], function(ch, key) {
  process.exit(0);
});

// Focus on `escape` or `i` when focus is on the screen.
screen.key(['escape', 'i'], function() {
  // Set the focus on the input.
  input.focus();
});

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

// If box is focused, handle `Control+s`.
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

screen.render();
/* global appendToBox*/
appendToBox = function(str, color){
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
/* global setOnUserScreen*/
setOnUserScreen = function(str){
  box2.insertBottom(str);
  screen.render();
};
/* global clearUserScreen*/
clearUserScreen = function(){
  box2.setContent('');
  screen.render();
};




