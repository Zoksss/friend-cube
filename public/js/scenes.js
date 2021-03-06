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




// events 

//join game events
mainMenuJoinGameBtn.addEventListener("click", () => {
    transitionAnim(mainMenuContainer, enterNicknameContainer);
});

enterNicknameContainerGoBackBtn.addEventListener("click", () =>{
    alertDestroy();
    transitionAnim(enterNicknameContainer, mainMenuContainer);
});



// create game events

mainMenuCreateGameBtn.addEventListener("click", () =>{
    transitionAnim(mainMenuContainer, choosePuzzleContainer);
});

choosePuzzleContainerGoBackBtn.addEventListener("click", () =>{
    transitionAnim(choosePuzzleContainer, mainMenuContainer);
});

createNicknameContainerGoBack.addEventListener("click", () =>{
    clearTimeout(t);
    transitionAnim(createNicknameContainer, choosePuzzleContainer);
});

