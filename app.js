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
let times = [];

const validateInput = (nickname, roomCode, puzzle) => {
  console.log(roomCode)
  if (nickname === "") return false;
  if (nickname.length < 3) return false;
  if (roomCode.length != 8) return false;
  if (puzzle != "3x3") return false;
  return true;
}

const checkIfEveryoneisFinished = (roomCode) => {
  let roomObject = activeRooms.find(o => o.roomId === roomCode);
  let temp = true;
  if (roomObject) {
    for (let i = 0; i < roomObject.sockets.length; i++) {
      if (roomObject.sockets[i].isFinished === false) {
        temp = false;
        break;
      }
    }
    return temp;
  }
  
}

const newRoundStart = () => {

}

io.on("connection", (socket) => {
  console.log("Made socket connection with id: " + socket.id);


  socket.on("leaderStartGamee", (roomCode) => {
    // someone clicked start game button 
    roomWhereIsLeader = activeRooms.find(o => o.leader === socket.id);
    if (roomWhereIsLeader) {
      // start the game
      console.log(roomWhereIsLeader);

      if (roomWhereIsLeader.roomId === roomCode) {
        io.in(roomWhereIsLeader.roomId).emit("startGame");
        roomWhereIsLeader.isLocked = true;

        for (let i = 0; i < roomWhereIsLeader.sockets.length; i++)
          roomWhereIsLeader.sockets[i].isFinished = false;
      }
      else console.log("jebem ti lebac hakerski...")

    }
  });

  socket.on("finalTime", (data) => {
    let roomCode = data.roomCode
    let time = data.time;
    console.log("vreme primljeno")
    let roomWhereSocketIs = activeRooms.find(o => o.roomId === roomCode);
    if (roomWhereSocketIs) {
      io.in(roomWhereSocketIs.roomId).emit("timeGetFromSocket", ({ socketName: socket.nickname, stime: time }));
    }
    roomWhereSocketIs.sockets.filter(o => o.socket === socket.id).isFinished = true;
    let socketObjectInRoom;
    for(let i = 0; i < roomWhereSocketIs.sockets.length; i++){
      if(roomWhereSocketIs.sockets[i].socketId === socket.id){ 
        socketObjectInRoom = roomWhereSocketIs.sockets[i];
        break;
      }
    }
    socketObjectInRoom.isFinished = true;
    console.table(activeRooms[0].sockets);
    console.log(checkIfEveryoneisFinished(roomCode));
    if (checkIfEveryoneisFinished(roomCode) === true) {
      // everyone is ready
       console.log("krvava majka");
        
      // start new round !
      io.in(roomCode).emit("ready");

      for (let i = 0; i < roomWhereSocketIs.sockets.length; i++)
        roomWhereSocketIs.sockets[i].isFinished = false;
        
    }
  });

  socket.on("join", (nickname, roomCode, puzzle) => {
    if (validateInput(nickname, roomCode, puzzle) === true) { // input is valid
      socket.nickname = nickname;
      let currRoom = activeRooms.find(o => o.roomId === roomCode);
      if (currRoom != undefined) {
        // room alredy exists
        if (currRoom.isLocked == false) {
          let socketId = socket.id
          currRoom.sockets.push({ socketId: socket.id, isFinished: true });
          socket.join(roomCode);
          // fire event for joining
          socket.emit("joinToTimer");
        }
        // else error - room is closed 
        socket.emit("serverError");
      }
      else {
        // creating room
        activeRooms.push({ roomId: roomCode, leader: socket.id, puzzle: puzzle, isLocked: false, sockets: [{ socketId: socket.id, isFinished: true }] })

        socket.join(roomCode);
        // fireing event for leader
        socket.emit("joinToTimerLeader", roomCode);

      }

      // update joined players status
      let msg = [];

      currRoom = activeRooms.find(o => o.roomId === roomCode);
      console.log(currRoom);
      if (currRoom != undefined) {
        msg = [];
        currRoom.sockets.forEach(socket => {
          msg.push(io.sockets.sockets[socket.socketId].nickname);
        });
        io.in(roomCode).emit("displayUsers", msg);
        console.log("Sent socket update : " + msg);
      }
    }

    // else error
    console.table(activeRooms);
  });
});
