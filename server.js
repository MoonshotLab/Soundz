// create web server
var express = require('express');
var http = require('http');
var path = require('path');
var port = process.env.PORT || 3000;
var app = express();
var arduino = require('./lib/arduino');
var soundLoop = require('./lib/soundLoop');



var pins = [
	11,
	0,
	10,
	8,
	0,
	0,
	3,
	11,
	0,
	10,
	8,
	0,
	0,
	0,
	0,
	0,
	0,
];



//	Web
//
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.get('/', function(req ,res){
	res.render('index');
	soundLoop.start(200,300);
});
var server = http.Server(app);
server.listen(port, function(){
  console.log('server started, listening on port ' + port + '...');
});


//	Socket -> Out
//
var io = require('socket.io')(server);
io.on('connection', function(socket){
	console.log('connected');
  	pins.forEach(function(val,i){
  		console.log("update display:"+i+" "+val);
		io.emit('update',{index:i,position:val});
	});
});


// Arduino -> In
//
var TIME_SLOTS = 15;
var reset = function(){
	pins = Array.apply(null, new Array(15)).map(Number.prototype.valueOf,0);
}
arduino.events().on('pinChange',function(pinIdx){
	console.log("pin:"+pinIdx);
	var pin = pins[pinIdx] = pins[pinIdx]+1;
	//soundLoop.updateNote(pinIdx, pin);
});