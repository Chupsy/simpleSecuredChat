exports.getCommand = function(line){
  if(line.indexOf('/') == 0){
    return line.indexOf(' ')>-1?line.substring(1, line.indexOf(' ')).trim() : line.substring(1).trim();
  }
  else return null;
};

exports.getData = function(line){
  if(line.indexOf('/') == 0){
    return line.indexOf(' ')>-1?line.substring(line.indexOf(' ')).trim() :null;
  }
  else return line.trim();
};