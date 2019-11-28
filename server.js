//Import express
var app = require('express')();

//Import HTTP and socketio
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Define our port
var port = process.env.PORT || 4000;

// GENERIC ROUTES ###################################################################################

app.get('/', function(req, res){
  io.emit('chat message', 'A new user has arrived.');
  res.sendFile(__dirname + '/index.html');
});

// SOCKET.IO ###################################################################################

io.on('connection', function(socket){
  socket.on('new-user', function(message){
    io.emit('new-user', {
      message: message
    });
  });
});

// START SERVER ###################################################################################

http.listen(port, function(){
  console.log('Server listening on ' + port);
});