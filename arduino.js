var SerialPort = require('serialport');
var firmata = require('firmata');


var readPin = function(board){
  board.pinMode(3, board.MODES.ANALOG);
  board.analogRead(3, function(val){
    console.log(val);
  });
};


var createBoard = function(comName){
  var board = new firmata.Board(comName, function(err){
    if(err) console.log(err);
    else readPin(board);
  });
};


SerialPort.list(function(err, ports){
  ports.forEach(function(port, i){
    if(port.manufacturer.indexOf('Arduino') != -1)
      createBoard(port.comName);
  });
});
