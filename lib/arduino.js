var events = require('events');
var emitter = new events.EventEmitter();
var SerialPort = require('serialport');
var firmata = require('firmata');
var previousPinVals = [];



var scheduleRead = function(board, index){
  board.analogRead(index, function(val){
    if(val > 100 && previousPinVal < 100){
      console.log('Pin Update', 'pin:', index, 'val:', val);
      emitter.emit('pinChange', index);

      previousPinVals = val;
    }
  });
};


var setupPin = function(board){
  for(var i=0; i<15; i++){
    previousPinVals[i] = 0;
    board.pinMode(i, board.MODES.ANALOG);
    scheduleRead(board, i);
  }
};


var createBoard = function(comName){
  var board = new firmata.Board(comName, function(err){
    if(err) console.log(err);
    else setupPin(board);
  });
};


SerialPort.list(function(err, ports){
  ports.forEach(function(port, i){
    if(port.manufacturer.indexOf('Arduino') != -1)
      createBoard(port.comName);
  });
});


exports.events = function(){
  return emitter;
};
