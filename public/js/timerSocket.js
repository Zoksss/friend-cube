let socket = io();

socket.on("connect", () => {
    console.log("Connected to the server");
})
/*
const leaderStartGameContainer = document.querySelector("#leaderStartGameContainer");
const waitForStartOverlay = document.querySelector("#waitForStartOverlay");

const leader = () => {
    waitForStartOverlay.style.display = "none";
    leaderStartGameContainer.style.display="flex";
}

leader();
*/