// create web server
var express = require('express');
var http = require('http');
var path = require('path');
var port = process.env.PORT || 3000;
var app = express();
var arduino = require('./lib/arduino');
var soundLoop = require('./lib/soundLoop');



//	Web
//
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.get('/', function(req ,res){
	res.render('index');
	
	soundLoop.start(1000,500);
	
	// FAKE
	if( req.query.mock == 'random') {
		setInterval(function(){
			var i = Math.round(Math.random()*14);
			arduino.events().emit('pinChange',i);
		},500)
	}
	else if( req.query.mock == 'line') {
		setInterval(function(){
			for( var i=0;i<15; i++) {
				arduino.events().emit('pinChange',i);
			}
		},2000)
	}


});
var server = http.Server(app);
server.listen(port, function(){
  console.log('server started, listening on port ' + port + '...');
});


//	Socket -> Out
//
var syncScreen=function(){
  	soundLoop.getNotes().forEach(function(val,i){
  		console.log("update display:"+i+" "+val);
		io.emit('update',{index:i,position:val});
	});
}
var io = require('socket.io')(server);
io.on('connection', function(socket){
	console.log('connected');
	syncScreen();
});
soundLoop.events().on('playNote',function(info){
	io.emit('beat',info);
});


// Arduino -> In
//
arduino.events().on('pinChange',function(pinIdx){
	console.log("pin:"+pinIdx);
	soundLoop.changeNote(pinIdx);
	var val = soundLoop.getNotes()[pinIdx];
	io.emit('update',{index:pinIdx,position:val});
});

