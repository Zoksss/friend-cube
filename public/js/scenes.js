// containers 
const mainMenuContainer = document.querySelector("#mainMenuContainer");
const enterNicknameContainer = document.querySelector("#enterNicknameContainer");
const choosePuzzleContainer = document.querySelector("#choosePuzzleContainer");
const createNicknameContainer = document.querySelector("#createNicknameContainer");

// buttons 
const mainMenuJoinGameBtn = document.querySelector("#mainMenuJoinGame");
const mainMenuCreateGameBtn = document.querySelector("#mainMenuCreateGame");
const enterNicknameContainerGoBackBtn = document.querySelector("#enterNicknameContainerGoBack");
const choosePuzzleContainerGoBackBtn = document.querySelector("#choosePuzzleContainerGoBack");
const createNicknameContainerGoBack = document.querySelector("#createNicknameContainerGoBack");

const enterNicknameContainerBtn = document.querySelector("#enterNicknameContainerBtn");
const createNicknameContainerBtn = document.querySelector("#createNicknameContainerBtn");



// events 

//join game events
mainMenuJoinGameBtn.addEventListener("click", () => {
    transitionAnim(mainMenuContainer, enterNicknameContainer);
});

enterNicknameContainerGoBackBtn.addEventListener("click", () =>{
    transitionAnim(enterNicknameContainer, mainMenuContainer);
});

enterNicknameContainerBtn.addEventListener("click", () =>{
    // join timer screen
});



// create game events

mainMenuCreateGameBtn.addEventListener("click", () =>{
    transitionAnim(mainMenuContainer, choosePuzzleContainer);
});

choosePuzzleContainerGoBackBtn.addEventListener("click", () =>{
    transitionAnim(choosePuzzleContainer, mainMenuContainer);
});

createNicknameContainerGoBack.addEventListener("click", () =>{
    transitionAnim(createNicknameContainer, choosePuzzleContainer);
});



function transitionAnim(hiddingElement, showingElement){   // transition between containers
    transitionHolder.classList.add("transition");
    setTimeout(() => {
        hiddingElement.style.display = "none";
        showingElement.style.display = "flex";  
    }, 300);
    
    transitionHolder.addEventListener('animationend', () => { transitionHolder.classList.remove("transition"); });
}