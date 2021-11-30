
const waitForStartOverlay = document.querySelector("#waitForStartOverlay");
const waitForStartLeaderOverlay = document.querySelector("#waitForStartLeaderOverlay");
const waitForStartLeaderOverlayRoomCode = document.querySelector("#waitForStartLeaderOverlayRoomCode");

const joinedUsersContainer = document.querySelector("#joinedUsersContainer");
const joinedUsersContainer2 = document.querySelector("#joinedUsersContainer2");

const codeElement = document.querySelector("#code");


let round = 0;

let socket = io();

socket.on("connect", () => {
    console.log("Connected to the server");
})

// first joined socekt is leader

socket.on("serverError", (msg) => {
    displayAlert(`Unable to join - ${msg}`);
});

socket.on("joinToTimer", () => {
    codeElement.innerHTML = "Room: "+ codeInput;
    transitionAnim(inputSection, timerSection);
    waitForStartLeaderOverlay.style.display = "none";
    waitForStartOverlay.style.display = "flex";
    timerSection.style.display = "block"
    console.log("test");
});

socket.on("joinToTimerLeader", (roomCode) => {
    codeElement.innerHTML = "Room: "+ roomCode;
    waitForStartOverlay.style.display = "none";
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
    let socketName = data.socketName;
    let time = data.stime;



    const tbody = document.createElement("tbody");
    tbody.classList.add(`tbody-row-group`);
    tbody.classList.add(`round-${round}`);
    tbody.innerHTML = `
    <tr class="round-marker">
        <td>Round <span id="roundCounterElement">${round}</span></td>
    </tr>
    `

    const element = document.createElement("tr");
    console.log(time.seconds.toString().length + "   " + "0" + time.seconds);
    element.innerHTML = `
    <tr>
        <td>${socketName}</td>
        <td>${(time.hours != 0) ? time.hours + ":" : ""}${(time.minutes != 0) ? time.minutes + ":" : ""}${(time.seconds.toString().length === 1) ? "0" + time.seconds : time.seconds}.${time.milliseconds}
    </td>`


    if (document.querySelector(`.round-${round}`)) {
        console.log("round shit alredy exist");

        tableInserttarget = document.querySelector(`.round-${round}`);
        tableInserttarget.append(element);
    }
    else {
        tableInserttarget = document.querySelector(".table-header");

        tableInserttarget.parentElement.insertBefore(tbody, tableInserttarget.nextSibling);
        tableInserttarget = tbody;
        tableInserttarget.append(element);
        tableInserttarget = element;
    }



})

socket.on("ready", () => {
    isReady = true;
    round++;
    console.log("now is ready")
})

socket.on("setScramble", (scramble) => {
    scrambleElement.innerHTML = scramble;
});


socket.on("joinedLeavedNotification", (data) => {
    console.log(data.nickname +" joined")
    let elem = document.createElement("p");
    elem.classList.add("notification");
    document.body.append(elem);
    elem.innerHTML = `${data.nickname} ${data.joined?"joined":"left"} the room`
    elem.addEventListener('animationend', () => {elem.parentNode.removeChild(elem);});
 
});



