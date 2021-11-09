
const waitForStartOverlay = document.querySelector("#waitForStartOverlay");
const waitForStartLeaderOverlay = document.querySelector("#waitForStartLeaderOverlay");
const waitForStartLeaderOverlayRoomCode = document.querySelector("#waitForStartLeaderOverlayRoomCode");

const joinedUsersContainer = document.querySelector("#joinedUsersContainer");
const joinedUsersContainer2 = document.querySelector("#joinedUsersContainer2");




let socket = io();

socket.on("connect", () => {
    console.log("Connected to the server");
})

// first joined socekt is leader

socket.on("serverError", () => {
    displayAlert("Error - Unable to join, try again");
});

socket.on("joinToTimer", () => {
    transitionAnim(inputSection, timerSection);
    waitForStartLeaderOverlay.style.display = "none";
    waitForStartOverlay.style.display = "flex";
    timerSection.style.display = "block"
    console.log("test");
});

socket.on("joinToTimerLeader", (roomCode) => {
    waitForStartOverlay.style.display= "none";
    waitForStartLeaderOverlay.style.display = "flex";
    waitForStartLeaderOverlayRoomCode.innerHTML = roomCode;
    transitionAnim(inputSection, timerSection);
    timerSection.style.display = "block";
});

socket.on("displayUsers", (users) => {
    
    let child = joinedUsersContainer.lastElementChild; 
    while (child) {
        joinedUsersContainer.removeChild(child);
        child = joinedUsersContainer.lastElementChild;
    }

    users.forEach(element => {
        let dom = document.createElement("p");
        dom.innerText = element
        joinedUsersContainer.append(dom);
    });

    let child2 = joinedUsersContainer2.lastElementChild; 
    while (child2) {
        joinedUsersContainer2.removeChild(child2);
        child2 = joinedUsersContainer2.lastElementChild;
    }

    users.forEach(element => {
        let dom = document.createElement("p");
        dom.innerText = element
        joinedUsersContainer2.append(dom);
    });
});

socket.on("startGame", () => {
    console.log("starting game");
    waitForStartOverlay.style.display = "none";
    waitForStartLeaderOverlay.style.display = "none";
    isReady = true;
})




let timesToAdd = [];

socket.on("timeGetFromSocket", (data) => {
    console.log("data je: ")
    //console.table(data);
    timesToAdd.push({socketName: data.socketName, time: data.stime})
    console.table(timesToAdd);
})

socket.on("ready", () => {
    isReady = true;
    console.log("now is ready")
})