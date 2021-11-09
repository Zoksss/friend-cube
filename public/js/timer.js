const hideOnStart = document.querySelectorAll(".hidden-on-start");
const mainTimeElement = document.querySelector("#time");

const ao5Element = document.querySelector("#ao5").children[0];
const ao12Element = document.querySelector("#ao12").children[0];

const sidebarTimes = document.querySelector("#sidebarTimes");
const scrambleElement = document.querySelector('#scramble');
const modal = document.querySelector(".modal");


let tableInserttarget = document.querySelector('#nullElement');

let currTimeIndex = 1;

let debounce = false, isTimerRunningTrue = false, isTimmerStoppedTrue = false, hideElementsOnStartTrue = true;

let timeBegan = null,
    timeStopped = null,
    stoppedDuration = 0,
    started = null;


let currentTime, timeElapsed, hour, min, sec, ms;

let times = [];

let isReady = false;

document.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 32 && !debounce && isReady) {
        debounce = true;

        console.log("Space clicked");

        if (!isTimerRunningTrue)
            mainTimeElement.style.color = "green";
        else {
            timerStop();
            isTimerRunningTrue = false;
            isTimmerStoppedTrue = true;
            if(hideElementsOnStartTrue) displayChange("block");
        }
    }
});

document.addEventListener("keyup", event => {
    if (event.isComposing || event.keyCode === 32 && debounce) {
        debounce = false;

        if (!isTimerRunningTrue && !isTimmerStoppedTrue) {
            isTimerRunningTrue = true;

            if (hideElementsOnStartTrue)
                displayChange("none");

            mainTimeElement.style.color = "#242424";
            timerReset();
            timerStart();
        }
        mainTimeElement.style.color = "#242424";
        isTimmerStoppedTrue = false
        return;
    }
});



const displayChange = displayVal => {
    hideOnStart.forEach(element => {
        element.style.display = displayVal;
    });
};


const timerStart = () => {
    if (timeBegan === null) timeBegan = new Date();
    if (timeStopped !== null) stoppedDuration += (new Date() - timeStopped);
    started = setInterval(clockRunning, 10);
}

const timerStop = () => {
    timeStopped = new Date();
    times.push({hours: hour, minutes: min, seconds: sec, milliseconds: ms});
    socket.emit("finalTime", {roomCode: codeInput.value, time: {hours: hour, minutes: min, seconds: sec, milliseconds: ms}});
    //console.table(times);
    clearInterval(started);
    scrambleElement.innerHTML = "Waiting for other players to finish solving..."
    isReady = false;
}

const timerReset = () => {
    clearInterval(started);
    stoppedDuration = 0;
    timeBegan = null;
    timeStopped = null;
}

function clockRunning() {
       currentTime = new Date()
        , timeElapsed = new Date(currentTime - timeBegan - stoppedDuration)
        , hour = timeElapsed.getUTCHours()
        , min = timeElapsed.getUTCMinutes()
        , sec = timeElapsed.getUTCSeconds()
        , ms = timeElapsed.getUTCMilliseconds();


    let hourString = (hour > 9 ? hour : "0" + hour) + ":",
        minString = (min > 9 ? min : "0" + min) + ":",
        secString = (sec > 9 ? sec : "0" + sec),
        milisString = (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms),

    timeString = (hour == 0 ? "" : hourString) + (min == 0 ? "" : minString) + (sec == 0 ? "" : secString) + "." + milisString
    mainTimeElement.innerHTML = timeString;
};



const displayTimes = () => {
    //ao5Element.innerHTML = calculateAo5();
    //ao12Element.innerHTML = calculateAo12();

    //socket.emit('ao5ao12', ao5Element.innerHTML, ao12Element.innerHTML);

    const elem = document.createElement('tr');

    elem.innerHTML =
        `
    <td class="table-no">${times.length}.</td>
    <td>${mainTimeElement.innerText}</td>
    `;

    tableInserttarget.parentNode.insertBefore(elem, tableInserttarget);
    tableInserttarget = elem;

    generateScramble("3X3");

}

const randomNum = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const isNumberEven = (num) => (num % 2  == 0) ? true : false;
