const enterNicknameContainerBtn = document.querySelector("#enterNicknameContainerBtn");
const createNicknameContainerBtn = document.querySelector("#createNicknameContainerBtn");

const timerSection = document.querySelector("#timerSection")
const inputSection = document.querySelector("#inputSection")

const nicknameInput = document.querySelector("#nicknameInput");
const codeInput = document.querySelector("#codeInput");


const alertBox = document.querySelector("#alert")

let urlString;
let selectedPuzzle;
let t;

enterNicknameContainerBtn.addEventListener("click", (e) => {
    inputLogic(e); 
    console.log(codeInput.value);
    socket.emit('join', nicknameInput.value, codeInput.value, "3x3");
});
createNicknameContainerBtn.addEventListener("click", (e) => {
    inputLogic(e); 
    socket.emit('join', nicknameInput.value, makeRoomId(8), selectedPuzzle);
});
const inputLogic = (e) => {
    e.preventDefault();
    clearTimeout(t);

    /* error codes

    0 - no error
    1 - empty nickname
    2 - nickname must be more than 3
    3 - code must be 8 characters

    */

    let inputState = validateInput();
    console.log(inputState);
    switch (inputState) {
        case 1:
            displayAlert("Nickname cannot be empty.")
            break;
        case 2:
            displayAlert("Nickname must be 3 or more characters")
            break;
        case 3:
            displayAlert("Code must be 8 characters.")
            break;
        default:
            console.log("Error");
            break;
    }
}

const displayAlert = (message) => {
    alertBox.innerHTML = message
    alertBox.style.display = "block"
    t = setTimeout(() => {
        alertBox.classList.add("alert-unload");
        setTimeout(() => alertDestroy, 300);
    }, 5000);
}

const alertDestroy = () => {
    alertBox.style.display = "none"
    alertBox.classList.remove("alert-unload");
}

const validateInput = () => {
    if (nicknameInput.value == "") return 1;
    if (nicknameInput.value.length < 3) return 2;
    if (codeInput.value.length != 8) return 3;
    return 0;
}


const selectPuzzle = puzzle => {
    selectedPuzzle = puzzle;
    transitionAnim(choosePuzzleContainer, createNicknameContainer);

}

const makeRoomId = length => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}






