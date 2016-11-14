exports.getCommand = function(line){
  line = line.trim();
  if(line.indexOf('/') == 0){
    return line.indexOf(' ')>-1?line.substring(1, line.indexOf(' ')).trim() : line.substring(1).trim();
  }
  else return null;
};

exports.getData = function(line){
  line = line.trim();
  if(line.indexOf('/') == 0){
    return line.indexOf(' ')>-1?line.substring(line.indexOf(' ')).trim() :null;
  }
  else return line.trim();
};

exports.getDataWithParams = function(line){
  line = line.trim();
  var dataToReturn = {
  };
  dataToReturn.data = line.indexOf(' ')>-1?line.substring(0, line.indexOf(' ')).trim() : line.trim();
  line = line.indexOf(' ')>-1?line.substring(line.indexOf(' ')).trim() : '';
  while(line.length >0){
    if(line.indexOf(' ')==-1){
      line = '';
    }
    else{
      var identifier = line.substring(line.indexOf('-')+1, line.indexOf(' '));
      line = line.substring(line.indexOf(' ')).trim();
      var data = line.indexOf(' ')>-1? line.substring(0, line.indexOf(' ')).trim() : line.trim();;
      line = line.indexOf(' ')>-1? line.substring(line.indexOf(' ')).trim() : '';
      if(identifier && data){
        dataToReturn[identifier] = data;
      }
    }
  }
  return dataToReturn;
};