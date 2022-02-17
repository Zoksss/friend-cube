
const waitForStartOverlay = document.querySelector("#waitForStartOverlay");
const waitForStartLeaderOverlay = document.querySelector("#waitForStartLeaderOverlay");
const waitForStartLeaderOverlayRoomCode = document.querySelector("#waitForStartLeaderOverlayRoomCode");

const joinedUsersContainer = document.querySelector("#joinedUsersContainer");
const joinedUsersContainer2 = document.querySelector("#joinedUsersContainer2");

const codeElement = document.querySelector("#code");

const playerRows = document.querySelector("#playerRows");
const playerModalTimes = document.querySelector("#playerModalTimes");
const playerContainerTitle = document.querySelector("#playerContainerTitle");


const onlineClients = document.querySelector("#onlineClients");



let round = 0;
let isGameStarted = false;
let timesToAdd = [];

let socket = io();
socket.on("connect", () => {
    console.log("Connected to the server");
});

socket.on("serverError", (msg) => {
    displayAlert(`Unable to join - ${msg}`);
});

socket.on("joinToTimer", () => {
    transitionAnim(inputSection, timerSection);
    setTimeout(() => {
        waitForStartLeaderOverlay.style.display = "none";
        waitForStartOverlay.style.display = "flex";
        timerSection.style.display = "block"
        applySettingsFromLocalStorage();

    }, 300);
});

socket.on("joinToTimerLeader", (roomCode) => {
    waitForStartOverlay.style.display = "none";
    waitForStartLeaderOverlay.style.display = "flex";
    waitForStartLeaderOverlayRoomCode.innerHTML = roomCode;
    transitionAnim(inputSection, timerSection);
    document.body.style.overflowY = "hidden";
    setTimeout(() => {
        timerSection.style.display = "block";
        applySettingsFromLocalStorage();

    }, 300);
});

socket.on("displayUsers", (users) => {

    let child = joinedUsersContainer.lastElementChild;
    while (child) {
        joinedUsersContainer.removeChild(child);
        child = joinedUsersContainer.lastElementChild;
    }

    let child2 = joinedUsersContainer2.lastElementChild;
    while (child2) {
        joinedUsersContainer2.removeChild(child2);
        child2 = joinedUsersContainer2.lastElementChild;
    }
    users.forEach(element => {
        let dom = document.createElement("p");
        dom.innerText = element
        joinedUsersContainer.append(dom);
    });


    let playersModalListElement = "";
    let as = `<a role="button" class="goback-from-player-btn" id="goBackFromPlayer">Go Back</a>`;
    users.forEach(element => {
        let dom = document.createElement("p");
        dom.innerText = element
        joinedUsersContainer2.append(dom);

        playersModalListElement +=
            `<div class="row">
            <h5>${element}</h5>
            <a role="button" class="view-more-btn" id="viewMoreBtn">View</a>
        </div>`
        playersModalListElement = playersModalListElement.trim();
        playerRows.innerHTML = playersModalListElement;

        if (isGameStarted) return;
        as += `
        <div id="${element}Row" class="stats-full">
            <table>
                <tr class="tb-heading-fix" id="${element}HeadingFix">
                    <td>round</td>
                    <td>time</td>
                    <td>ao5</td>
                    <td>ao12</td>
                </tr>
            </table>
        </div>`
        playerModalTimes.innerHTML = as;
    });
});


const showFullPlayerStats = (nickname, toShow) => {
    if (!toShow) {
        playerModalTimes.style.display = "none";
        playerRows.style.display = "block";
        playerContainerTitle.innerHTML = "Joined Player's Stats";
        for (let i = 1; i < playerModalTimes.children.length; i++)
            playerModalTimes.children[i].style.display = "none";
        return;

    }
    playerModalTimes.style.display = "flex";
    playerRows.style.display = "none";
    playerContainerTitle.innerHTML = nickname;
    if (document.querySelector(`#${nickname.toString()}Row`) != undefined) {
        document.querySelector(`#${nickname.toString()}Row`).style.display = "block";
    }

};
const addTimeToPlayerModal = (nickname, time) => {
    if (!document.querySelector(`#${nickname}HeadingFix`)) return;
    let tableHeading = document.querySelector(`#${nickname}HeadingFix`)
    let element = document.createElement("tr");
    
    element.innerHTML =
        `
        <td>${round}</td>
        <td>${time.time}</td>
        <td>${time.ao5}</td>
        <td>${time.ao12}</td>
    `
    tableHeading.parentNode.insertBefore(element, tableHeading.parentElement.children[1]);
}


document.addEventListener("click", (e) => {
    if (e.target && e.target.id == "viewMoreBtn") {
        let name = e.target.parentElement.children[0].innerText;
        showFullPlayerStats(name, true)
    }
    if (e.target && e.target.id == "goBackFromPlayer") {
        let name = e.target.parentElement.children[0].innerText;
        showFullPlayerStats(name, false)
    }
});

socket.on("startGame", () => {
    waitForStartOverlay.style.display = "none";
    waitForStartLeaderOverlay.style.display = "none";
    isReady = true;
    isGameStarted = true;
})

socket.on("timeGetFromSocket", (data) => {
    let socketName = data.socketName;
    let time = data.stime;
    let ao5 = data.ao5;
    let ao12 = data.ao12;
    let finishStatus = data.finishStatus;

    if (finishStatus === "dnf")
        addTimeToPlayerModal(socketName, { time: "DNF", ao5: ao5, ao12: ao12 });
    else
        addTimeToPlayerModal(socketName, { time: `${(time.hours != 0) ? time.hours + ":" : ""}${(time.minutes != 0) ? time.minutes + ":" : ""}${time.seconds}.${time.milliseconds}${finishStatus === "plus2" ? "+" : ""}`, ao5: ao5, ao12: ao12 });

    const tbody = document.createElement("tbody");
    tbody.classList.add(`tbody-row-group`);
    tbody.classList.add(`round-${round}`);
    tbody.innerHTML = `
    <tr class="round-marker" id="round${round}scramble" onClick="showScramble(this, ${round})">
        <td>Round <span id="roundCounterElement">${round}</span></td>
    </tr>
    `
    const element = document.createElement("tr");
    if (finishStatus === "dnf") {
        element.innerHTML = `
        <tr>
            <td>${socketName}</td>
            <td>DNF</td>
        </td>`
    } else {
        element.innerHTML = `
        <tr>
            <td>${socketName}</td>
            <td>${(time.hours != 0) ? time.hours + ":" : ""}${(time.minutes != 0) ? time.minutes + ":" : ""}${(time.seconds)}.${time.milliseconds}${finishStatus === "plus2" ? "+" : ""}</td>
        </td>`
    }
    if (document.querySelector(`.round-${round}`)) {
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
});

socket.on("ready", () => {
    isReady = true;
    round++;
});

socket.on("setScramble", (scramble) => {
    scrambleElement.innerHTML = scramble;
});


socket.on("joinedLeavedNotification", (data) => {
    let elem = document.createElement("p");
    elem.classList.add("notification");
    document.body.append(elem);
    elem.innerHTML = `${data.nickname} ${data.joined ? "joined" : "left"} the room`
    elem.addEventListener('animationend', () => { elem.parentNode.removeChild(elem); });
});


socket.on("onlineClientChange", (num) => {
    onlineClients.innerHTML = `Online: ${num}`;
})

socket.on("leaderLeft", () => {
    location.reload();
});


const scrambleContainer = document.querySelector("#scrambleContainer");
const scrambleContainerScrambles = document.querySelector("#scrambleContainerScrambles");

const showScramble = (dom, roundE) => {
    console.log(dom);
    let scrambleTargetId = dom.id+"Element"
    let targetElement = document.querySelector("#"+scrambleTargetId);
    if(targetElement){
        for(let i = 0; i < scrambleContainerScrambles.children.length; i++){
            scrambleContainerScrambles.children[i].style.display = "none"
        }
        scrambleContainerTitle.innerHTML=`Round ${roundE} scramble`
        targetElement.style.display = "flex";
        scrambleContainer.style.display = "flex";
        
    }
};

const closescrambleContainer = document.querySelector("#closescrambleContainer");
closescrambleContainer.addEventListener("click", () => {
    scrambleContainer.style.display = "none"
});