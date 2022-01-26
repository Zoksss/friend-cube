const hideOnStart = document.querySelectorAll(".hidden-on-start");
const mainTimeElement = document.querySelector("#time");

const ao5Element = document.querySelector("#ao5").children[0];
const ao12Element = document.querySelector("#ao12").children[0];

const sidebarTimes = document.querySelector("#sidebarTimes");
const scrambleElement = document.querySelector('#scramble');
const modal = document.querySelector(".modal");

const finishedBtn = document.querySelector('#finishedBtn');
const dnfBtn = document.querySelector('#dnfBtn');
const plus2Btn = document.querySelector('#plus2Btn');
const resetBtn = document.querySelector('#resetBtn');
const chooseRoundFinish = document.querySelector("#chooseRoundFinish");

let tableInserttarget = document.querySelector('#nullElement');

let currTimeIndex = 1;
let debounce = false
    , isTimerRunningTrue = false
    , isTimmerStoppedTrue = false
    , hideElementsOnStartTrue = true
    , hideTimeElementOnStart = false;


let timeBegan = null
    , timeStopped = null
    , stoppedDuration = 0
    , started = null;

let currentTime, timeElapsed, hour, min, sec, ms;

let times = [];

let isReady = false;

let canShowFinishScreen = false;
let textColor = "#242424";


let canStartTimer = false;



document.querySelector(".timer-container").addEventListener("touchstart", (event) => {
    if (!debounce && isReady && !canChoose && canStartTimer) {
        hasHolded();
        debounce = true;
        stopTimerLogic();
        
    }
});

document.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 32 && !debounce && isReady && !canChoose) {
        isHoldingTimerRunning = true;
        hasHolded();
        debounce = true;
        stopTimerLogic();
    }
});

const stopTimerLogic = () => {
    if (!isTimerRunningTrue)
        mainTimeElement.style.color = "red";
    else {
        timerStop();
        isTimerRunningTrue = false;
        isTimmerStoppedTrue = true;
        if (hideElementsOnStartTrue) displayChange("flex");
        if (hideTimeElementOnStart) mainTimeElement.style.display = "flex";
    }
}

document.querySelector(".timer-container").addEventListener("touchend", () => {
    if (debounce) {
        debounce = false;
        if (isTimmerStoppedTrue) {
            setTimeout(() => {
                canChoose = true;
                chooseRoundFinish.style.display = "flex";
            }, 100);
        }
        startTimerLogic();
    }
});
document.addEventListener("keyup", event => {
    if (event.isComposing || event.keyCode === 32 && debounce) {
        debounce = false;
        if (isTimmerStoppedTrue) {
            setTimeout(() => {
                canChoose = true;
                chooseRoundFinish.style.display = "flex";
            }, 100);
        }
        startTimerLogic();
    }
});

const startTimerLogic = () => {
    if (!isTimerRunningTrue && !isTimmerStoppedTrue && canStartTimer) {
        isTimerRunningTrue = true;
        canStartTimer = false;

        if (hideElementsOnStartTrue) displayChange("none");
        if (hideTimeElementOnStart) mainTimeElement.style.display = "none";

        mainTimeElement.style.color = textColor;
        timerReset();
        timerStart();
    }
    mainTimeElement.style.color = textColor;
    isTimmerStoppedTrue = false
    return;
}


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

let finishStatus = ""
let canChoose = false;

finishedBtn.addEventListener("click", () => {
    if (canChoose) {
        finishStatus = "";
        canChoose = false;
        chooseRoundFinish.style.display = "none";
        timerStopPush();
    }
});
dnfBtn.addEventListener("click", () => {
    if (canChoose) {
        finishStatus = "dnf";
        canChoose = false;
        chooseRoundFinish.style.display = "none";
        timerStopPush();
    }
});
plus2Btn.addEventListener("click", () => {
    if (canChoose) {
        finishStatus = "plus2";
        timeElapsed.setSeconds(timeElapsed.getSeconds() + 2)
        hour = timeElapsed.getUTCHours();
        min = timeElapsed.getUTCMinutes();
        sec = timeElapsed.getUTCSeconds();
        ms = timeElapsed.getUTCMilliseconds();


        canChoose = false;
        chooseRoundFinish.style.display = "none";
        timerStopPush();
    }
});
resetBtn.addEventListener("click", () => {
    if (canChoose) {
        finishStatus = "reset";
        canChoose = false;
        chooseRoundFinish.style.display = "none";
    }
});


const timerStop = () => {

    timeStopped = new Date();
    clearInterval(started);
}

const timerStopPush = () => {
    let curTime = {
        hours: hour
        , minutes: min
        , seconds: sec
        , milliseconds: ms
        , finishStatus: finishStatus
    }

    times.push(curTime);
    ao5Element.innerHTML = calculateAo5();
    ao12Element.innerHTML = calculateAo12();

    socket.emit("finalTime", {
        roomCode: codeInput.value
        , time: curTime
        , ao5: ao5Element.innerHTML
        , ao12: ao12Element.innerHTML
        , finishStatus: finishStatus
    });

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

    let hourString = (hour > 9 ? hour : "0" + hour) + ":"
        , minString = (min > 9 ? min : "0" + min) + ":"
        , secString = (sec > 9 ? sec : "0" + sec)
        , milisString = (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms),

        timeString = (hour == 0 ? "" : hourString) + (min == 0 ? "" : minString) + secString + "." + milisString
    mainTimeElement.innerHTML = timeString;
};


const calculateAo5 = () => {
    let i = times.length;
    if (i < 5) return "--";
    for (let i = times.length - 1; i >= times.length - 5; i--) {
        if (times[i].finishStatus === "dnf") return "DNF";
    }
    if (times.length - 5 < 0) i = 0;
    else i = times.length - 5;

    let averageHours = 0
        , averageMinutes = 0
        , averageSeconds = 0
        , averageMilliseconds = 0;

    let counter = 0;
    for (i; i < times.length; i++) {
        averageHours += times[i].hours;
        averageMinutes += times[i].minutes;
        averageSeconds += times[i].seconds;
        averageMilliseconds += times[i].milliseconds;
        counter++;
    }
    let allMillisecodns = averageMilliseconds + averageSeconds * 1000 + averageMinutes * 60 * 1000 + averageHours * 60 * 60 * 1000

    return msToTime(Math.round(allMillisecodns /= counter));
}

const calculateAo12 = () => {
    let i = times.length;
    if (i < 12) return "--";
    for (let i = times.length - 1; i >= times.length - 12; i--) {
        if (times[i].finishStatus === "dnf") return "DNF";
    }
    i = times.length - 12;

    let averageHours = 0
        , averageMinutes = 0
        , averageSeconds = 0
        , averageMilliseconds = 0;

    let counter = 0;
    for (i; i < times.length; i++) {
        averageHours += times[i].hours;
        averageMinutes += times[i].minutes;
        averageSeconds += times[i].seconds;
        averageMilliseconds += times[i].milliseconds;
        counter++;
    }
    let allMillisecodns = averageMilliseconds + averageSeconds * 1000 + averageMinutes * 60 * 1000 + averageHours * 60 * 60 * 1000

    return msToTime(Math.round(allMillisecodns /= counter));
}


const msToTime = (s) => {
    const pad = (n, z) => {
        z = z || 2;
        if (n == 0) return "";
        return ('00' + n)
            .slice(-z);
    }
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;
    return pad(hrs) + ((hrs > 0) ? ":" : "") + pad(mins) + ((mins > 0) ? ":" : "") + ((secs.toString()
        .length === 1) ? "0" + secs : secs) + '.' + pad(ms, 3);
}

const randomNum = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const isNumberEven = (num) => (num % 2 == 0) ? true : false;