function transitionAnim(hiddingElement, showingElement) {   // transition between containers
    transitionHolder.classList.add("transition");
    transitionHolder.addEventListener("animationstart", () => {
        setTimeout(() => {
            hiddingElement.style.display = "none";
            showingElement.style.display = "flex";
        }, 300);
    })

    transitionHolder.addEventListener('animationend', () => { transitionHolder.classList.remove("transition"); });
}


const inputLogic = (e) => {
    nicknameInput.classList.remove("input-warning");
    nicknameInputOnCreate.classList.remove("input-warning");
    codeInput.classList.remove("input-warning");
    e.preventDefault();
    clearTimeout(t);

    let inputState = validateInput();
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
            displayAlert("Code must be 8 characters long.")
            return false;
        case 5:
            codeInput.classList.add("input-warning");
            displayAlert("Code must be only numbers")
            return false;
        default:
            return false;
    }
}

const displayAlert = (message) => {
    alertBox.innerHTML = message
    alertBox.style.display = "block"
    t = setTimeout(() => {
        alertBox.classList.add("alert-unload");
        alertDestroy();
    }, 4000);
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
    if (!isLetter(nicknameInput.value.charAt(0)) && !isLetter(nicknameInputOnCreate.value.charAt(0))) return 3;
    for (let i = 0; i < nicknameInput.value.length; i++)if (!isLetter(nicknameInput.value.charAt(i)) && !isLetter(nicknameInputOnCreate.value.charAt(i)));
    if (codeInput.value.length != 8) return 4;
    for (let i = 0; i < codeInput.value.length; i++) if (isNaN(codeInput.value.charAt(i))) return 5;
    return 0;
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
const selectPuzzle = (puzzle) => {
    if (puzzle != "3x3" && puzzle != "2x2" && puzzle != "pyra") {
        displayAlert("Error - Puzzle is not implemented yet");
        return;
    }
    selectedPuzzle = puzzle;
    puzzleEl.innerHTML = selectedPuzzle;
    transitionAnim(choosePuzzleContainer, createNicknameContainer);
}

const makeRoomId = (length) => {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}






const isMobile = (x) => {
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

let x = window.matchMedia("(max-width: 1376px)")
isMobile(x) // Call listener function at run time
x.addListener(isMobile) // Attach listener function on state changes
