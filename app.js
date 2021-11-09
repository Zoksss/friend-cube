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
let isRoomReady = []; // {roomId, sockets[{socketId: "asdjfh123sdf_1sf", isReady: false}]}

const validateInput = (nickname, roomCode, puzzle) => {
  console.log(roomCode)
  if (nickname === "") return false;
  if (nickname.length < 3) return false;
  if (roomCode.length != 8) return false;
  if (puzzle != "3x3") return false;
  return true;
}

const checkIfEveryoneIsReady = (roomCode) => {
  let roomObject = activeRooms.find(o => o.roomId === roomCode);
  if(roomObject){
    for(let i = 0; i <= roomObject.sockets.length; i++){
      if(roomObject.sockets[i].isReady === false) {
        return false;
      }
      else{
        return true;
      }
    }
  }
  return false;
}


io.on("connection", (socket) => {
  console.log("Made socket connection with id: " + socket.id);
  
  socket.on("leaderStartGamee", (roomCode) => {
    // someone clicked start game button 
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

  socket.on("finalTime", (data) => {
    let roomCode = data.roomCode
    let time = data.time;
    console.log("vreme primljeno")
    let roomWhereSocketIs = activeRooms.find(o => o.roomId === roomCode);
    let socketRoom = roomWhereSocketIs.sockets.filter(o => o.socketId === socket.id)
    if(socketRoom){
      isRoomReady.push({roomId: roomCode, sockets: [{socketId: socket.id, isReady: true}]});
      io.in(roomWhereSocketIs.roomId).emit("timeGetFromSocket", ({socketName: socket.nickname, stime: time }));
    }
    console.log(checkIfEveryoneIsReady(roomCode));
    if(checkIfEveryoneIsReady(roomCode)){
      // everyone is ready
      io.in(roomCode).emit("ready");
      for(let i = 0; i < roomWhereSocketIs.sockets.length; i++)
        roomWhereSocketIs.sockets[i].isReady = true;
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
          currRoom.sockets.push({socketId: socket.id, isReady: true});
          socket.join(roomCode);
          // fire event for joining
          socket.emit("joinToTimer");
        }
        // else error - room is closed 
        socket.emit("serverError");
      }
      else {
        // creating room
        activeRooms.push({ roomId: roomCode, leader: socket.id, puzzle: puzzle, isLocked: false, sockets: [{socketId: socket.id, isReady: true}]})

        socket.join(roomCode);
        // fireing event for leader
        socket.emit("joinToTimerLeader", roomCode);

      }

      // update joined players status
      let msg = [];

      currRoom = activeRooms.find(o => o.roomId === roomCode);
      console.log(currRoom);
      if (currRoom != undefined) {
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
