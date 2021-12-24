
const waitForStartOverlay = document.querySelector("#waitForStartOverlay");
const waitForStartLeaderOverlay = document.querySelector("#waitForStartLeaderOverlay");
const waitForStartLeaderOverlayRoomCode = document.querySelector("#waitForStartLeaderOverlayRoomCode");

const joinedUsersContainer = document.querySelector("#joinedUsersContainer");
const joinedUsersContainer2 = document.querySelector("#joinedUsersContainer2");

const codeElement = document.querySelector("#code");

const playerRows = document.querySelector("#playerRows");
const playerModalTimes = document.querySelector("#playerModalTimes"); 



let round = 0;
let isGameStarted = false;

let socket = io();

socket.on("connect", () => {
    console.log("Connected to the server");
});

socket.on("serverError", (msg) => {
    displayAlert(`Unable to join - ${msg}`);
});

socket.on("joinToTimer", () => {
    //codeElement.innerHTML = "Room: "+ codeInput.value;
    document.body.style.overflowY = "hidden";
    transitionAnim(inputSection, timerSection);
    setTimeout(() => {  // wait for anim to 50%
        waitForStartLeaderOverlay.style.display = "none";
        waitForStartOverlay.style.display = "flex";
        timerSection.style.display = "block"
    }, 300);
});

socket.on("joinToTimerLeader", (roomCode) => {
    //codeElement.innerHTML = "Room: "+ roomCode;
    waitForStartOverlay.style.display = "none";
    waitForStartLeaderOverlay.style.display = "flex";
    waitForStartLeaderOverlayRoomCode.innerHTML = roomCode;
    transitionAnim(inputSection, timerSection);
    document.body.style.overflowY = "hidden";
    setTimeout(() => {  // wait for anim to 50%
        timerSection.style.display = "block";
    }, 300);
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
        
        if(isGameStarted) return;
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


const playerContainerTitle = document.querySelector("#playerContainerTitle");


const showFullPlayerStats = (nickname, toShow) => {
    if(!toShow){
        playerModalTimes.style.display = "none";
        playerRows.style.display = "block";
        playerContainerTitle.innerHTML = "Joined Player's Stats";
        for(let i = 1; i < playerModalTimes.children.length; i++)
            playerModalTimes.children[i].style.display = "none";
        return;
        
    }
    playerModalTimes.style.display = "flex";
    playerRows.style.display = "none";
    playerContainerTitle.innerHTML = nickname;
    if(document.querySelector(`#${nickname.toString()}Row`) != undefined){
        document.querySelector(`#${nickname.toString()}Row`).style.display = "block";
    }

};
const addTimeToPlayerModal = (nickname, time) => {
    
    if(!document.querySelector(`#${nickname}HeadingFix`)) return;
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


document.addEventListener("click",function(e){
    if(e.target && e.target.id=="viewMoreBtn"){
        let name = e.target.parentElement.children[0].innerText;
        showFullPlayerStats(name, true)
     }
    if(e.target && e.target.id=="goBackFromPlayer"){
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


let timesToAdd = [];



socket.on("timeGetFromSocket", (data) => {
    //console.table(data);
    let socketName = data.socketName;
    let time = data.stime;
    let ao5 = data.ao5;
    let ao12 = data.ao12;

    addTimeToPlayerModal(socketName, {time: `${(time.hours != 0) ? time.hours + ":" : ""}${(time.minutes != 0) ? time.minutes + ":" : ""}${(time.seconds.toString().length === 1) ? "0" + time.seconds : time.seconds}.${time.milliseconds}`, ao5: ao5, ao12: ao12});

    const tbody = document.createElement("tbody");
    tbody.classList.add(`tbody-row-group`);
    tbody.classList.add(`round-${round}`);
    tbody.innerHTML = `
    <tr class="round-marker">
        <td>Round <span id="roundCounterElement">${round}</span></td>
    </tr>
    `

    const element = document.createElement("tr");
    element.innerHTML = `
    <tr>
        <td>${socketName}</td>
        <td>${(time.hours != 0) ? time.hours + ":" : ""}${(time.minutes != 0) ? time.minutes + ":" : ""}${(time.seconds.toString().length === 1) ? "0" + time.seconds : time.seconds}.${time.milliseconds}
    </td>`


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
    elem.innerHTML = `${data.nickname} ${data.joined?"joined":"left"} the room`
    elem.addEventListener('animationend', () => {elem.parentNode.removeChild(elem);});

 
});