let elapsedTime = 0, prevTime = 0;
let stopwatchInterval;


const hasHolded = () => {
    if (!stopwatchInterval) {
        stopwatchInterval = setInterval(() => {
          if (!prevTime) {
            prevTime = Date.now();
          }
          
          elapsedTime += Date.now() - prevTime;
          prevTime = Date.now();
          if(elapsedTime >= timems){
            stopHolding();
            mainTimeElement.style.color = "green";
            canStartTimer = true;
          }else canStartTimer = false;
          
        }, 10);
      }
}

const stopHolding = () => {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
      }
      prevTime = null;
      elapsedTime = 0;
}

document.addEventListener("keyup", event => {
    if (event.isComposing || event.keyCode === 32 && debounce) {
        stopHolding();
    }
});

document.querySelector(".timer-container").addEventListener("touchend", () => {
    if (debounce) {
        stopHolding();
    }
})