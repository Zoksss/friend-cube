const leaderStartGameContainer = document.querySelector("#leaderStartGameContainer");
const waitForStartOverlay = document.querySelector("#waitForStartOverlay");

const leader = () => {
    waitForStartOverlay.style.display = "none";
    leaderStartGameContainer.style.display="flex";
}

leader();