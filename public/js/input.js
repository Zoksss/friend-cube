
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



const alertBox = document.querySelector("#alert")

let urlString;
let selectedPuzzle;
let t;

enterNicknameContainerBtn.addEventListener("click", (e) => {
    if (inputLogic(e))
        socket.emit('join', nicknameInput.value, codeInput.value, "3x3");
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
    console.log("123");
    playerModal.style.display = "none";
});

//playerModal.addEventListener("click", () => {
//    playerModal.style.display = "none";
//});




exitRoom.addEventListener("click", () => {
    location.reload();
})



const inputLogic = (e) => {
    nicknameInput.classList.remove("input-warning");
    nicknameInputOnCreate.classList.remove("input-warning");
    codeInput.classList.remove("input-warning");
    e.preventDefault();
    clearTimeout(t);

    let inputState = validateInput();
    console.log(inputState);
    switch (inputState) {
        case 0:
            return true;
        case 1:
            nicknameInput.classList.add("input-warning");
            nicknameInputOnCreate.classList.add("input-warning");
            displayAlert("Nickname cannot be empty.");
            return false;
        case 2:
            nicknameInput.classList.add("input-warning");
            nicknameInputOnCreate.classList.add("input-warning");
            displayAlert("Nickname must be 3 or more characters")
            return false;
        case 3:
            nicknameInput.classList.add("input-warning");
            nicknameInputOnCreate.classList.add("input-warning");
            displayAlert("Nickname must start with letter: [A-Z, a-z]")
            return false;
        case 4:
            codeInput.classList.add("input-warning");
            displayAlert("Code must be 8 characters.")
            return false;
        default:
            console.log("Error");
            return false;
    }
}

const displayAlert = (message) => {
    alertBox.innerHTML = message
    alertBox.style.display = "block"
    t = setTimeout(() => {
        alertBox.classList.add("alert-unload");
        alertDestroy();
    }, 5000);
}

const alertDestroy = () => {
    setTimeout(() => {
        alertBox.style.display = "none"
        alertBox.classList.remove("alert-unload");
    }, 300);

}

const validateInput = () => {
    if (nicknameInput.value === "" && nicknameInputOnCreate.value === "") return 1;
    if (nicknameInput.value.length < 3 && nicknameInputOnCreate.value.length < 3) return 2;
    if (!isLetter(nicknameInput.value.charAt(0))) return 3;
    if (codeInput.value.length != 8) return 4;
    return 0;
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

const selectPuzzle = (puzzle) => {
    selectedPuzzle = puzzle;
    transitionAnim(choosePuzzleContainer, createNicknameContainer);
}

const makeRoomId = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

leaderStartGame.addEventListener("click", () => {
    console.log("fireinbg start");
    socket.emit("leaderStartGamee", codeInput.value);
});








function isMobile(x) {
    if (!x.matches) {
        // above 768
        sidebar.classList.add("sidebar-anim-open");
        openSideBar.style.display = "none";

        setTimeout(() => {
            sidebar.style.left = "0px";
            isSidebarOpen = true;
        }, 200);

        sidebar.addEventListener('animationend', () => { sidebar.classList.remove("sidebar-anim-open"); openSideBar.classList.remove("sidebar-btn-anim-open"); });

    } else {
        // under 768
        sidebar.classList.add("sidebar-anim-close");
        openSideBar.style.display = "block"
        openSideBar.classList.add("sidebar-btn-anim-close");
        setTimeout(() => {
            sidebar.style.left = "-300px";
            openSideBar.style.left = "0px";
            isSidebarOpen = false;
        }, 200);

        sidebar.addEventListener('animationend', () => { sidebar.classList.remove("sidebar-anim-close"); openSideBar.classList.remove("sidebar-btn-anim-close"); });

    }
}

let x = window.matchMedia("(max-width: 1024px)")
isMobile(x) // Call listener function at run time
x.addListener(isMobile) // Attach listener function on state changes

