const waitForStartOverlay = document.querySelector("#waitForStartOverlay");
const waitForStartLeaderOverlay = document.querySelector("#waitForStartLeaderOverlay");
const waitForStartLeaderOverlayRoomCode = document.querySelector("#waitForStartLeaderOverlayRoomCode");

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
});

socket.on("joinToTimerLeader", (roomCode) => {
    waitForStartOverlay.style.display= "none";
    waitForStartLeaderOverlay.style.display = "flex";
    waitForStartLeaderOverlayRoomCode.innerHTML = roomCode;
    transitionAnim(inputSection, timerSection);
    timerSection.style.display = "block";
});