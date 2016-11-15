var blessed = require('blessed');
var screen = blessed.screen({
  smartCSR: true
});

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
    }
  }
});

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

var pwdPrompt = blessed.box({
  top : 'center',
  left : 'center',
  height: 3,
  content : 'PASSWORD : ',
  hidden : true,
  width: 'half',
  border: {
    type: 'ascii'
  },
  style: {
    fg: 'green',
    bg: 'black'
  }
});
var pwdInput = blessed.textbox({
  width : '89%',
  left : '10%',
  censor : true,
  inputOnFocus: true,
  style: {
    fg: '#787878',
    bg: '#454545',
    focus: {
      fg: '#f6f6f6',
      bg: '#353535'
    }
  }
});
pwdPrompt.append(pwdInput);


screen.append(input);
screen.append(pwdPrompt);

input.focus();
screen.render();
module.exports.box = box;
module.exports.box2 = box2;
module.exports.input = input;
module.exports.pwdPrompt = pwdPrompt;
module.exports.pwdInput = pwdInput;
module.exports.screen = screen;

module.exports.promptPassword = function(cb){
  pwdPrompt.setContent('PASSWORD : ');
  pwdPrompt.hidden = false;
  if(input.focused){
    input.focus();
  }
  pwdInput.focus();
  pwdInput.key('enter', function(ch, key) {
    var line = this.getValue();
    this.clearValue();
    input.focus();
    pwdPrompt.hidden = true;
    screen.render();
    cb(line);
  });
};