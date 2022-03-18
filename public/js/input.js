
const enterNicknameContainerBtn = document.querySelector("#enterNicknameContainerBtn");
const createNicknameContainerBtn = document.querySelector("#createNicknameContainerBtn");
const leaderStartGame = document.querySelector("#leaderStartGame");

const timerSection = document.querySelector("#timerSection")
const inputSection = document.querySelector("#inputSection")

const nicknameInput = document.querySelector("#nicknameInput");
const nicknameInputOnCreate = document.querySelector("#nicknameInputOnCreate");
const codeInput = document.querySelector("#codeInput");

const exitRoom = document.querySelector("#exitRoom");
const openSideBar = document.querySelector("#openSideBar");


const openPlayersBtn = document.querySelector("#openPlayersBtn");
const playerModal = document.querySelector("#playerModal");
const settingsModal = document.querySelector(".settings-container");

const alertBox = document.querySelector("#alert");

const puzzleEl = document.querySelector("#puzzle");


let urlString;
let selectedPuzzle = "3x3";
let t;

enterNicknameContainerBtn.addEventListener("click", (e) => {
    if (inputLogic(e))
        socket.emit('join', nicknameInput.value, codeInput.value, selectedPuzzle);
});
createNicknameContainerBtn.addEventListener("click", (e) => {
    codeInput.value = makeRoomId(8);
    if (inputLogic(e))
        socket.emit('join', nicknameInputOnCreate.value, codeInput.value, selectedPuzzle);
        
});


let isSidebarOpen = false;
const sidebar = document.querySelector("#sidebar");

openSideBar.addEventListener("click", (e) => {

    if (!isSidebarOpen) {
        // open it
        sidebar.classList.add("sidebar-anim-open");
        openSideBar.classList.add("sidebar-btn-anim-open");

        setTimeout(() => {
            sidebar.style.left = "0px";
            openSideBar.style.left = "270px";
            isSidebarOpen = true;
        }, 200);

        sidebar.addEventListener('animationend', () => { sidebar.classList.remove("sidebar-anim-open"); openSideBar.classList.remove("sidebar-btn-anim-open"); });
    }
    else {
        // close it 
        sidebar.classList.add("sidebar-anim-close");
        openSideBar.classList.add("sidebar-btn-anim-close");
        setTimeout(() => {
            sidebar.style.left = "-300px";
            openSideBar.style.left = "0px";
            isSidebarOpen = false;
        }, 200);

        sidebar.addEventListener('animationend', () => { sidebar.classList.remove("sidebar-anim-close"); openSideBar.classList.remove("sidebar-btn-anim-close"); });
    }
});


openPlayersBtn.addEventListener("click", () => {
    playerModal.style.display = "flex";
});
closePlayerModalBtn.addEventListener("click", () => {
    playerModal.style.display = "none";
});




exitRoom.addEventListener("click", () => {
    location.reload();
})



leaderStartGame.addEventListener("click", () => {
    socket.emit("leaderStartGamee", codeInput.value);
});


document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", (e) => {
        if(e.target.classList.contains("modal")) e.target.style.display = "none";
    })
})
