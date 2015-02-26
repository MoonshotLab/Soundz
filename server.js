// create web server
var express = require('express');
var http = require('http');
var path = require('path');
var port = process.env.PORT || 3000;
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var server = http.Server(app);
server.listen(port, function(){
  console.log('server started, listening on port ' + port + '...');
});


app.get('/', function(req ,res){
  res.render('index');
});


var io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('connected');
});
