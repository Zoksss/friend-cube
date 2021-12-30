const socketio = require("socket.io");
const express = require("express");

// App setup
const PORT = process.env.PORT || 3000;
const app = express();
const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
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
let onlineClients = 0;

io.on("connection", (socket) => {
    console.log("Made socket connection with id: " + socket.id);
    onlineClients++;
    io.sockets.emit('onlineClientChange', onlineClients);
    socket.on("join", (nickname, roomCode, puzzle) => {
        if (validateInput(nickname, roomCode, puzzle)) {
            if (doesUsernameAlrdeyExists(nickname, roomCode)) {
                socket.emit("serverError", "Nickname alredy used in this room.");
                return;
            }
            if (rooms[roomCode] != undefined) {
                if (!rooms[roomCode].isLocked) {
                    socket.nickname = nickname;
                    io.in(roomCode).emit("joinedLeavedNotification", { nickname: nickname, joined: true });
                    rooms[roomCode].addSocket(socket);
                    socket.join(roomCode);
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

        } else socket.emit("serverError", "Input not valid");

        //doesUsernameAlrdeyExists(socket.nickname, roomCode);
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
        io.in(data.roomCode).emit("timeGetFromSocket", ({ socketName: socket.nickname, stime: data.time, ao5: data.ao5, ao12: data.ao12, finishStatus: data.finishStatus}));
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
            if (!roomNames[i] === socket.id) continue;
            if (!rooms[roomNames[i]]) return;
            io.in(roomNames[i]).emit("joinedLeavedNotification", { nickname: socket.nickname, joined: false });
            rooms[roomNames[i]].removeSocket(socket);
            checkIfRoomIsEmpty(roomNames[i]);
            updateWaitingScreenStatus(roomNames[i]);
            return;
        }
    });
    socket.on('disconnect', () => {
        onlineClients--;
        io.sockets.emit('onlineClientChange', onlineClients);
    })
});


// functions

const checkIfRoomIsEmpty = (roomCode) => {
    if (rooms[roomCode].sockets.length != 0) return;
    delete rooms[roomCode];
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
    if(!isLetter(nickname.charAt(0))) return false;
    if (nickname.length < 3) return false;
    if (roomCode.length != 8) return false;
    if (puzzle != "3x3") return false;
    return true;
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
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

const generateScramble = (puzzle) => {
    let scrambele = "";
    for (a = y = r = '', x = Math.random; a++ < 22; scrambele += (r + " '2"[0 | x(y = r) * 3] + ' '))
        for (; r == y; r = 'RLUDFB'[0 | x() * 6]);
    return scrambele;
}

const doesUsernameAlrdeyExists = (nickname, roomCode) => {
    let socketsInRoom = io.sockets.adapter.rooms[roomCode];
    if (socketsInRoom && socketsInRoom.sockets) {
        console.log(socketsInRoom.sockets);
        for (let clientId in socketsInRoom.sockets) {
            console.log(io.sockets.connected[clientId].nickname + " / " + nickname);
            if (io.sockets.connected[clientId].nickname === nickname) {
                console.log("isti username");
                return true;
            }
        }
        return false;
    }
}