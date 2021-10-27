const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = process.env.PORT || 5500;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);






io.on("connection", (socket) => {
  console.log("Made socket connection with id: " + socket.id);



});
