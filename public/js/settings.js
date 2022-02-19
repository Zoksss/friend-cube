const settings = document.querySelector("#openSettingsBtn");
const closeSettingsModalBtn = document.querySelector("#closeSettingsModalBtn");

const bgColorInput = document.querySelector("#bgColorInput");
const textColorInput = document.querySelector("#textColorInput");
const holdToStartMsInput = document.querySelector("#holdToStartMsInput");

let hideOnStartInput = document.querySelector("#hideOnStart");
let hideTimeOnStartEl = document.querySelector("#hideTimeOnStart");

const settingsApplyButton = document.querySelector("#settingsApplyButton");
const resetToDefaultButton = document.querySelector("#resetToDefaultButton");

settings.addEventListener("click", () => {
    settingsModal.style.display = "flex";
});

let timems = 500;
let bgColor = ""

const defaultValues = [
    "#242424",
    "#EFF8FF",
    "#FFFFFF",
]

const textElements = [
    document.querySelector("#time"),
    document.querySelector("#ao5"),
    document.querySelector("#ao12"),
    document.querySelector("#puzzle"),
    document.querySelector("#scramble"),
    document.querySelector("#sidebarTitle"),
    document.querySelector("#sidebarTimes"),
    document.querySelector("#playerContainerTitle"),
    document.querySelector(".modal-container"),
    document.querySelector(".plus2-btn"),
    document.querySelector(".dnf-btn"),
    document.querySelector(".x-btn"),
    document.querySelector(".settings-box"),
    document.querySelector(".settings-container-reset"),
    document.querySelector("#playerRows"),
    document.querySelector("#playerModalTimes"),
];


const backgroundElements = [
    document.body,
    document.querySelector(".plus2-btn"),
    document.querySelector(".dnf-btn"),
    document.querySelector(".x-btn"),
    document.querySelector(".choose-round-finish-container"),

];
const backgroundElementsLighter = [
    document.querySelector("#sidebar"),
    document.querySelector("#openSideBar"),
    document.querySelector(".modal-container"),
    document.querySelector(".plus2-btn"),
    document.querySelector(".dnf-btn"),
    document.querySelector(".x-btn"),
    document.querySelector(".settings-box"),
    document.querySelector(".player-info-container"),
];

settingsApplyButton.addEventListener("click", () => {
    settingsModal.style.display = "none";
    textColor = textColorInput.value;
    bgColor = bgColorInput.value;
    timems = holdToStartMsInput.value; 
    hideElementsOnStartTrue = hideOnStartInput.checked;
    hideTimeElementOnStart = hideTimeOnStartEl.checked;
    localStorage.setItem("settings", JSON.stringify({ textColor: textColorInput.value, bgColor: bgColorInput.value, timems: timems, heos: hideOnStartInput.checked, hteos: hideTimeOnStartEl.checked}));
    applySettings();
});

const applySettingsFromLocalStorage = () => {
    if (localStorage.getItem("settings") !== null) {
        let settings = JSON.parse(localStorage.getItem("settings"));
        textColor = settings.textColor
        bgColor = settings.bgColor
        timems = settings.timems || 500;
        holdToStartMsInput.value = timems;
        hideOnStartInput.checked = settings.heos;
        hideTimeOnStartEl.checked = settings.hteos;
        applySettings();
    }
} 

const applySettings = () => {
    backgroundElements.forEach(element => {
        element.style.backgroundColor = bgColor;
    })
    backgroundElementsLighter.forEach(element => {
        element.style.backgroundColor = lightenDarkenColor(bgColor, 30);
    })
    textElements.forEach(element => {
        element.style.color = textColor;
    })
    textColorInput.value = textColor;
    bgColorInput.value = bgColor;

    hideElementsOnStartTrue = hideOnStartInput.checked;
    hideTimeOnStart = hideTimeOnStartEl.checked;
}


resetToDefaultButton.addEventListener("click", () => {
    settingsModal.style.display = "none";
    textColor = defaultValues[0];
    bgColor = defaultValues[1];
    hideOnStartInput.checked = true;
    hideElementsOnStartTrue = true;
    timems = 500;
    holdToStartMsInput.value = timems;
    hideOnStartInput.checked = true;
    hideTimeOnStartEl.checked = false;
    applySettings();
    localStorage.setItem("settings", JSON.stringify({ textColor: textColorInput.value, bgColor: bgColorInput.value, timems: timems, heos: hideOnStartInput.checked, hteos: hideTimeOnStart.checked}));

});

closeSettingsModalBtn.addEventListener("click", () => {
    settingsModal.style.display = "none";
})

function lightenDarkenColor(col, amt) {
    let usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}