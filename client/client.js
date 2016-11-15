var blessed = require('./screen/screen.js');
var screenCommands = require('./screen/commands.js');
var input = blessed.input;
var screen = blessed.screen;

screen.key(['q', 'C-c'], function(ch, key) {
  process.exit(0);
});

screen.key(['escape', 'i'], function() {
  // Set the focus on the input.
  if(blessed.pwdPrompt.hidden){
    input.focus();
  }
  else{
    blessed.pwdInput.focus();
  }
});



screen.render();
