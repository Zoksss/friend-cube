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
        let socketObj = this.sockets.find(o => o.socketId === socket.id);
        this.sockets.splice(this.sockets.indexOf(socketObj), 1);
        socketObj = null;
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
            if (rooms[roomCode] != undefined) {
                if (!rooms[roomCode].isLocked) {
                    socket.nickname = nickname;
                    io.in(roomCode).emit("joinedLeavedNotification", { nickname: nickname, joined: true });
                    rooms[roomCode].addSocket(socket);
                    socket.join(roomCode);
                    // fire event for joining
                    socket.emit("joinToTimer");
                    updateWaitingScreenStatus(roomCode);
                }
                else socket.emit("serverError", "Room Closed");
            }
            else {
                socket.nickname = nickname;
                rooms[roomCode] = new Room(socket.id, puzzle);
                socket.join(roomCode);
                socket.emit("joinToTimerLeader", roomCode);
                io.in(roomCode).emit("joinedLeavedNotification", { nickname: nickname, joined: true });
                updateWaitingScreenStatus(roomCode);
            }

        }
        //doesUsernameAlrdeyExists(socket.nickname, roomCode);
        // update joined players status

    });

    socket.on("leaderStartGamee", (roomCode) => {
        // start game
        if (!rooms[roomCode]) return;
        if (!rooms[roomCode].sockets.filter(o => o.leader === socket.id));

        rooms[roomCode].isLocked = true;
        for (let i = 0; i < rooms[roomCode].sockets.length; i++)
            rooms[roomCode].sockets[i].isFinished = false;

        io.in(roomCode).emit("setScramble", generateScramble("3X3"));
        io.in(roomCode).emit("startGame");


    });

    socket.on("finalTime", (data) => {
        if (!rooms[data.roomCode]) return;
        let socketObjectInRoom = rooms[data.roomCode].sockets.find(o => o.socketId === socket.id);
        if (!socketObjectInRoom) return;

        io.in(data.roomCode).emit("timeGetFromSocket", ({ socketName: socket.nickname, stime: data.time }));
        socketObjectInRoom.isFinished = true;

        if (!isEveryoneFinished(data.roomCode)) return;
        io.in(data.roomCode).emit("ready");
        for (let i = 0; i < rooms[data.roomCode].sockets.length; i++)
            rooms[data.roomCode].sockets[i].isFinished = false;

        io.in(data.roomCode).emit("setScramble", generateScramble("3X3"));

    });

    socket.on('disconnecting', () => {

        let roomNames = Object.keys(socket.rooms);
        for (let i = 0; i < roomNames.length; i++) {
            if (roomNames[i] === socket.id) continue;
            io.in(roomNames[i]).emit("joinedLeavedNotification", { nickname: socket.nickname, joined: false });
            rooms[roomNames[i]].removeSocket(socket);
            checkIfRoomIsEmpty(roomNames[i]);
            updateWaitingScreenStatus(roomNames[i]);
            break;
        }
    });

    socket.on("disconnect", () => {
        console.log('Got disconnect! ' + socket.id);
        console.log(rooms);
    });
});




// functions

const checkIfRoomIsEmpty = (roomCode) => {
    if (rooms[roomCode].sockets.length != 0) return;
    delete rooms[roomCode];
    //rooms[roomCode] = null;
    console.log("Room " + roomCode + " deleted (empty)");

}

const updateWaitingScreenStatus = (roomCode) => {
    let msg = [];
    if (!rooms[roomCode]) return;
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


const doesUsernameAlrdeyExists = (socketobj, roomCode) => {
    let socketsInRoom = io.sockets.adapter.rooms[roomCode].sockets;
    for (var clientId in socketsInRoom) {
        console.log(io.connected[clientId]);
        if(io.connected[clientId].nickname === nickname) return true;
    }
    return false;
}

const generateScramble = (puzzle) => {
    let scrambele = "";
    for (a = y = r = '', x = Math.random; a++ < 22; scrambele += (r + " '2"[0 | x(y = r) * 3] + ' '))for (; r == y; r = 'RLUDFB'[0 | x() * 6]);
    return scrambele;
}