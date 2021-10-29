const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = process.env.PORT || 3000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

let activeRooms = [

]

io.on("connection", (socket) => {
  console.log("Made socket connection with id: " + socket.id);

  socket.on("join", (nickname, roomCode, puzzle) => {
    if(roomCode.toString().length === 8){
      socket.nickname = nickname;
      let obj = activeRooms.find(o => o.name === roomCode)
      if(obj == null){
        activeRooms.push({roomId: roomCode, leader: socket.id, puzzle: puzzle, isLocked: false, sockets: [socket.id]})
        console.table(activeRooms);
      }

      socket.join(roomCode);
    }
  })
});
