//Import express
var app = require('express')();

//Import HTTP and socketio
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Define our port
var port = process.env.PORT || 4000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('new-user', function(message){
    io.emit('new-user', message);
  });
});

http.listen(port, function(){
  console.log('Server listening on ' + port);
});
