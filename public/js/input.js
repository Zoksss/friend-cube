const enterNicknameContainerBtn = document.querySelector("#enterNicknameContainerBtn");
const createNicknameContainerBtn = document.querySelector("#createNicknameContainerBtn");

const nicknameInput = document.querySelector("#nicknameInput");
const codeInput = document.querySelector("#codeInput");

let urlString;
let selectedPuzzle;

enterNicknameContainerBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    urlString = `${window.location.origin}/public/timer.html?nickname=${nicknameInput.value}&code=${codeInput.value}`;
    let url = new URL(urlString);
    window.location.href = url;
});

createNicknameContainerBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    urlString = `${window.location.origin}/public/timer.html?nickname=${nicknameInput.value}&code=${makeRoomId(8)}&puzzle=${selectedPuzzle}`;
    let url = new URL(urlString);
    window.location.href = url;
});


const selectPuzzle = puzzle => {
    selectedPuzzle = puzzle;
    transitionAnim(choosePuzzleContainer, createNicknameContainer);

}

const makeRoomId = length => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}



// first joined socekt is leader