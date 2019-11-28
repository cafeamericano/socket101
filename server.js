const cluster = require("cluster");

//Import express
var app = require('express')();

//Import HTTP and socketio
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Define our port
var port = process.env.PORT || 4000;



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Code to run if we're in the master process
if (cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = require("os").cpus().length;
  console.log(cpuCount)
  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on("exit", function(worker) {
    // Replace the dead worker, we're not sentimental
    console.log("Worker %d died :(", worker.id);
    cluster.fork();
  });

  // Code to run if we're in a worker process
} else {
  app.get('/', function(req, res){
    io.emit('chat message', 'A new user has arrived.');
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
}