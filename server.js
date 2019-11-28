//Cluster
const cluster = require("cluster");

//Redis
var redis = require("redis");
var client = redis.createClient();

//Import express
var app = require('express')();

//Import HTTP and socketio
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Define our port
var port = process.env.PORT || 4000;

  // CLUSTER ###################################################################################

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

  // GENERIC ROUTES ###################################################################################

  app.get('/', function(req, res){
    io.emit('chat message', 'A new user has arrived.');
    res.sendFile(__dirname + '/index.html');
  });
  
  // SOCKET.IO ###################################################################################

  io.on('connection', function(socket){
    socket.on('new-user', function(message){
      io.emit('new-user', {
        worker: cluster.worker.id,
        message: message
      });
    });
  });

  // REDIS ROUTES###################################################################################

  //Pull first name
  app.get("/firstname", (req, res) => {
    //To set in Redis CLI -> ex) SET firstName "Matthew"
    client.get("firstName", function(err, reply) {
      res.send(reply);
    });
  });

  //Pull value from string
  app.get("/:search_key", (req, res) => {
    client.get(req.params.search_key, function(err, reply) {
      res.send(reply);
    });
  });

  //Pull keys and values from hash
  app.get("/username/:search_key", (req, res) => {
    client.hgetall("username:" + req.params.search_key, function(err, reply) {
      res.json(reply);
    });
  });

  //Pull keys and values from hash
  app.get(
    "/newhash/:username/:firstname/:lastname/:favoritecolor",
    (req, res) => {
      console.log("route hit for adding new hash");
      let query = [
        `username:${req.params.username}`,
        `firstname`,
        `${req.params.firstname}`,
        `lastname`,
        `${req.params.lastname}`,
        `favoritecolor`,
        `${req.params.favoritecolor}`
      ];
      console.log(query);
      client.hmset(query, function(err, reply) {
        res.send(reply);
      });
    }
  );
  
  //###################################################################################

  http.listen(port, function(){
    console.log('Server listening on ' + port);
  });

}