const sockets = require("socket.io");
const express = require("express");

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
const io = sockets(server);



let activeRooms = [];

const validateInput = (nickname, roomCode, puzzle) => {
  console.log(roomCode)
  if (nickname === "") return false;
  if (nickname.length < 3) return false;
  if (roomCode.length != 8) return false;
  if (puzzle != "3x3") return false;
  return true;
}


io.on("connection", (socket) => {
  console.log("Made socket connection with id: " + socket.id);
  
  socket.on("leaderStartGamee", (roomCode) => {

    // someone clicked start game button 
    console.log("test na serveru krvavu ti majku jebem")
    roomWhereIsLeader = activeRooms.find(o => o.leader === socket.id);
    if (roomWhereIsLeader) {
      // start the game
      console.log(roomWhereIsLeader);

      if(roomWhereIsLeader.roomId === roomCode){
        io.in(roomWhereIsLeader.roomId).emit("startGame");
        roomWhereIsLeader.isLocked = true;
      }
      else console.log("jebem ti lebac hakerski...")
    }
  });

  socket.on("join", (nickname, roomCode, puzzle) => {
    if (validateInput(nickname, roomCode, puzzle) === true) { // input is valid
      socket.nickname = nickname;
      let currRoom = activeRooms.find(o => o.roomId === roomCode);
      if (currRoom != undefined) {
        // room alredy exists
        if (currRoom.isLocked == false) {
          currRoom.sockets.push(socket.id);
          socket.join(roomCode);
          // fire event for joining
          socket.emit("joinToTimer");
        }
        // else error - room is closed 
        socket.emit("serverError");
      }
      else {
        // creating room
        activeRooms.push({ roomId: roomCode, leader: socket.id, puzzle: puzzle, isLocked: false, sockets: [socket.id] })
        socket.join(roomCode);
        // fireing event for leader
        socket.emit("joinToTimerLeader", roomCode);
      }

      // update joined players status
      let msg = [];

      currRoom = activeRooms.find(o => o.roomId === roomCode);
      console.log(currRoom);
      if (currRoom != undefined) {
        currRoom.sockets.forEach(socketId => {
          msg.push(io.sockets.sockets[socketId].nickname);
        });
        io.in(roomCode).emit("displayUsers", JSON.stringify(msg));
        console.log("Sent socket update : " + msg);
      }
    }

    // else error
    console.table(activeRooms);
  });
});
