var events = require('events');
var emitter = new events.EventEmitter();
var SerialPort = require('serialport');
var firmata = require('firmata');
var pinTimeouts = {};



var scheduleRead = function(board, index){
  board.analogRead(index, function(val){
    if(val !==0 && pinTimeouts[index] === null){
      emitter.emit('pinChange', index);
      pinTimeouts[index] = setTimeout(function(){
        pinTimeouts[index] = null;
      }, 1000);
    }
  });
};


var setupPin = function(board){
  for(var i=0; i<2; i++){
    pinTimeouts[i] = null;
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
