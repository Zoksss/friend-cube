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
    2 - empty code
    3 - nickname must be more than 3
    4 - code must be 8 characters

    */

    let inputState = validateInput();
    console.log(inputState);
    switch (inputState) {
        case 0:
            transitionAnim(inputSection, timerSection);
            timerSection.style.display = "block"
            break;
        case 1:
            alertBox.innerHTML = "Nickname cannot be empty."
            displayAlert()
            break;
        case 2:
            alertBox.innerHTML = "Code cannot be empty."
            displayAlert()
            break;
        case 3:
            alertBox.innerHTML = "Nickname must be 3 or more characters"
            displayAlert()
            break;
        case 4:
            alertBox.innerHTML = "Code must be 8 characters."
            displayAlert()
            break;
        default:
            transitionAnim(inputSection, timerSection);
            timerSection.style.display = "block"
            break;
    }
}

const displayAlert = (type) => {
    alertBox.style.display = "block"
    t = setTimeout(() => {
        alertBox.classList.add("alert-unload");
        setTimeout(() => alertDestroy, 300);
    }, 5000);
}

const validateInput = () => {
    if (nicknameInput.value == "") return 1;
    if (codeInput.value == "") return 2;
    if (nicknameInput.value.length < 3) return 3;
    if (codeInput.value.length != 8) return 4;
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


const alertDestroy = () => {
    alertBox.style.display = "none"
    alertBox.classList.remove("alert-unload");
}


// first joined socekt is leader
