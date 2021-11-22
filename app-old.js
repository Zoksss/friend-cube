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

const roomsMethods = {
  searchRoomObject: (roomCode) => {
    return activeRooms.find(o => o.roomId === roomCode);
  },
  searchRoomWhereIsLeader: (socket) => {
    return activeRooms.find(o => o.leader === socket.id);
  },
  searchSocketsArrForSocketObject: (roomObject, socket) => {
    return roomObject.sockets.filter(o => o.socket === socket.id)
  },
  isEveryoneFinished: (roomCode) => {
    let roomObject = roomsMethods.searchRoomObject();
    if(roomObject){
      let temp = true;
      for (let i = 0; i < roomObject.sockets.length; i++) {
        if (roomObject.sockets[i].isFinished === false) {
          temp = false;
          break;
        }
      }
      return temp;
    }
  }

} 

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

io.on("connection", (socket) => {
    console.log("Made socket connection with id: " + socket.id);
  
  
    socket.on("leaderStartGamee", (roomCode) => {
      let roomWhereIsLeader = roomsMethods.searchRoomWhereIsLeader(socket);
      if (roomWhereIsLeader) {
        // start the game
        if (roomCode === roomWhereIsLeader.roomId) {
          roomWhereIsLeader.isLocked = true;
          for (let i = 0; i < roomWhereIsLeader.sockets.length; i++)
            roomWhereIsLeader.sockets[i].isFinished = false;
  
            io.in(roomCode).emit("startGame");
        }
        else console.log("jebem ti lebac hakerski...")
      }
    });
  
    socket.on("finalTime", (data) => {
      let roomWhereSocketIs = roomsMethods.searchRoomObject(data.roomCode);
      if (roomWhereSocketIs) {
        io.in(roomWhereSocketIs.roomId).emit("timeGetFromSocket", ({ socketName: socket.nickname, stime: data.time }));
      }
      roomsMethods.searchSocketsArrForSocketObject(roomWhereSocketIs, socket).isFinished = true;
      let socketObjectInRoom;
      for(let i = 0; i < roomWhereSocketIs.sockets.length; i++){
        if(roomWhereSocketIs.sockets[i].socketId === socket.id){ 
          socketObjectInRoom = roomWhereSocketIs.sockets[i];
          break;
        }
      }
      socketObjectInRoom.isFinished = true;
      if (roomsMethods.isEveryoneFinished(data.roomCode) === true){
        // start new round !
        io.in(data.roomCode).emit("ready");
        for (let i = 0; i < roomWhereSocketIs.sockets.length; i++)
          roomWhereSocketIs.sockets[i].isFinished = false;
        }
    });
  
    socket.on("join", (nickname, roomCode, puzzle) => {
      if (validateInput(nickname, roomCode, puzzle) === true) { 
        // input is valid
        socket.nickname = nickname;
        let currRoom = roomsMethods.searchRoomObject(roomCode);
        if (currRoom) {
          // room alredy exists
          if (currRoom.isLocked === false) {
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
          socket.emit("joinToTimerLeader", roomCode);
  
        }
  
        // update joined players status
        let msg = [];
        console.log(currRoom);
        if (currRoom) {
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
  
    socket.on("leave", (roomCode) => {
      // someone clicked leave 
      let currRoom = activeRooms.find(o => o.roomId === roomCode);
      if(currRoom){
        let socketInRoomobject = currRoom.sockets.filter(o => o.socketId = socket.id);
        if(socketInRoomobject){
          delete socketInRoomobject;
          socket.leave(roomCode);
          console.log(activeRooms);
        }
      }
    });
  
  });