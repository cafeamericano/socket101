const cluster = require("cluster");
const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

// // Code to run if we're in the master process
// if (cluster.isMaster) {
//   // Count the machine's CPUs
//   var cpuCount = require("os").cpus().length;

//   // Create a worker for each CPU
//   for (var i = 0; i < cpuCount; i += 1) {
//     cluster.fork();
//   }

//   // Listen for dying workers
//   cluster.on("exit", function(worker) {
//     // Replace the dead worker, we're not sentimental
//     console.log("Worker %d died :(", worker.id);
//     cluster.fork();
//   });

//   // Code to run if we're in a worker process
// } else {
// Add a basic route – index page
app.get("/", function(request, response) {
  // console.log("Request to worker %d", cluster.worker.id);
  //response.send("Hello from Worker " + cluster.worker.id);
  response.sendFile("/index.html");
});

console.log("listening");
// Bind to a port
server = app.listen(4001);

const io = require("socket.io")(server);

io.on("connection", socket => {
  console.log("New user connected");

  socket.on("hello", data => {
    socket.message = data.message;
  });

  socket.on("world", data => {
    io.sockets.emit("world", {
      text: "banana",
      text2: "tree"
    });
  });
});

//   console.log("Worker %d running!", cluster.worker.id);
// }
