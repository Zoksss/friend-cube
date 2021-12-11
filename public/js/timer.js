const hideOnStart = document.querySelectorAll(".hidden-on-start");
const mainTimeElement = document.querySelector("#time");

const ao5Element = document.querySelector("#ao5").children[0];
const ao12Element = document.querySelector("#ao12").children[0];

const sidebarTimes = document.querySelector("#sidebarTimes");
const scrambleElement = document.querySelector('#scramble');
const modal = document.querySelector(".modal");

let tableInserttarget = document.querySelector('#nullElement');


let currTimeIndex = 1;
let debounce = false
    , isTimerRunningTrue = false
    , isTimmerStoppedTrue = false
    , hideElementsOnStartTrue = true;

let timeBegan = null
    , timeStopped = null
    , stoppedDuration = 0
    , started = null;

let currentTime, timeElapsed, hour, min, sec, ms;

let times = [];

let isReady = false;

document.querySelector(".timer-container").addEventListener("touchstart", () => {
    if (!debounce && isReady) {
        keyPressedTimer();
    }
});

document.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 32 && !debounce && isReady) {
        keyPressedTimer();
    }
});

const keyPressedTimer = () => {
    debounce = true;

    console.log("Space clicked");

    if (!isTimerRunningTrue)
        mainTimeElement.style.color = "green";
    else {
        timerStop();
        isTimerRunningTrue = false;
        isTimmerStoppedTrue = true;
        if (hideElementsOnStartTrue) displayChange("block");
    }
}

document.querySelector(".timer-container").addEventListener("touchend", () => {
    if (debounce) {
        keyLeftTimer();
    }
});

document.addEventListener("keyup", event => {
    if (event.isComposing || event.keyCode === 32 && debounce) {
        keyLeftTimer();
    }
});

const keyLeftTimer = () => {
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
    let curTime = {
        hours: hour
        , minutes: min
        , seconds: sec
        , milliseconds: ms
    }
    times.push(curTime);

    ao5Element.innerHTML = calculateAo5();
    ao12Element.innerHTML = calculateAo12()
    socket.emit("finalTime", {
        roomCode: codeInput.value
        , time: curTime
        , ao5: ao5Element.innerHTML
        , ao12: ao12Element.innerHTML
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