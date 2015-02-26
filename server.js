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
	soundLoop.start(125,500);
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
	syncScreen();
});


// FAKE
var i = 0;
setInterval(function(){
	arduino.events().emit('pinChange',i);
	
	i=(i+1) % 15;

},100)