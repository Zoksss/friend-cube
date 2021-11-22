const socketio = require("socket.io");
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
const io = socketio(server);


class Room {
    constructor(leader, puzzle) {
        this.leader = leader;
        this.puzzle = puzzle;
        this.isLocked = false;
        this.sockets = [{ socketId: leader, isFinished: true }];
    }
    addSocket(socket) {
        this.sockets.push({ socketId: socket.id, isFinished: true });
    }
    removeSocket(socket) {
        delete this.sockets.filter(o => o.socketId = socket.id);
    }
}

let rooms = {};

const test = (socket, roomCode) => {
    rooms[roomCode].removeSocket(socket);
    console.log(rooms);
}

io.on("connection", (socket) => {
    console.log("Made socket connection with id: " + socket.id);

    socket.on("join", (nickname, roomCode, puzzle) => {
        if (validateInput(nickname, roomCode, puzzle)) {
            socket.nickname = nickname;
            if (rooms[roomCode] != undefined) {
                if (!rooms[roomCode].isLocked) {
                    rooms[roomCode].addSocket(socket);
                    socket.join(roomCode);
                    // fire event for joining
                    socket.emit("joinToTimer");
                }
                else socket.emit("serverError", "Room Closed");
            }
            else {
                rooms[roomCode] = new Room(socket.id, puzzle);
                socket.join(roomCode);
                socket.emit("joinToTimerLeader", roomCode);
            }
            console.log(rooms);

        }
        // update joined players status
        updateWaitingScreenStatus(roomCode);
    });

    socket.on("leaderStartGamee", (roomCode) => {
        // start game
        if (!rooms[roomCode]) return;
        if (!rooms[roomCode].sockets.filter(o => o.leader === socket.id));

        rooms[roomCode].isLocked = true;
        for (let i = 0; i < rooms[roomCode].sockets.length; i++)
            rooms[roomCode].sockets[i].isFinished = false;

        io.in(roomCode).emit("startGame");


    });

    socket.on("finalTime", (data) => {
        if (!rooms[data.roomCode]) return;
        let socketObjectInRoom = rooms[data.roomCode].sockets.find(o => o.socketId === socket.id);
        if (!socketObjectInRoom) return;

        io.in(data.roomCode).emit("timeGetFromSocket", ({ socketName: socket.nickname, stime: data.time }));
        socketObjectInRoom.isFinished = true;

        if (isEveryoneFinished(data.roomCode) === true) {
            io.in(data.roomCode).emit("ready");
            for (let i = 0; i < rooms[data.roomCode].sockets.length; i++)
                rooms[data.roomCode].sockets[i].isFinished = false;

        }

    });


});




// functions

const updateWaitingScreenStatus = (roomCode) => {
    let msg = [];
    rooms[roomCode].sockets.forEach(socket => {
        msg.push(io.sockets.sockets[socket.socketId].nickname);
    });
    io.in(roomCode).emit("displayUsers", msg);
}

const validateInput = (nickname, roomCode, puzzle) => {
    if (nickname === "") return false;
    if (nickname.length < 3) return false;
    if (roomCode.length != 8) return false;
    if (puzzle != "3x3") return false;
    return true;
}

const isEveryoneFinished = (roomCode) => {
    let temp = true;
    for (let i = 0; i < rooms[roomCode].sockets.length; i++) {
        if (rooms[roomCode].sockets[i].isFinished === false) {
            temp = false;
            break;
        }
    }
    return temp;
}