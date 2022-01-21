const settings = document.querySelector("#openSettingsBtn");
const closeSettingsModalBtn = document.querySelector("#closeSettingsModalBtn");

const bgColorInput = document.querySelector("#bgColorInput");
const textColorInput = document.querySelector("#textColorInput");

const hideOnStartInput = document.querySelector("#hideOnStart");

const settingsApplyButton = document.querySelector("#settingsApplyButton");
const resetToDefaultButton = document.querySelector("#resetToDefaultButton");

settings.addEventListener("click", () => {
    settingsModal.style.display = "flex";
})


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

];

settingsApplyButton.addEventListener("click", () => {
    settingsModal.style.display = "none";
    textColor = textColorInput.value;
    bgColor = bgColorInput.value;
    if (!hideOnStartInput.checked) hideElementsOnStartTrue = false;
    else hideElementsOnStartTrue = true;
    localStorage.setItem("settings", JSON.stringify({ textColor: textColorInput.value, bgColor: bgColorInput.value, hideElementsOnStartTrue: hideElementsOnStartTrue }));
    applySettings();
});

const applySettingsFromLocalStorage = () => {
    if (localStorage.getItem("settings") !== null) {
        let settings = JSON.parse(localStorage.getItem("settings"));
        textColor = settings.textColor
        bgColor = settings.bgColor
        hideElementsOnStartTrue = settings.hideElementsOnStartTrue;
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
}


resetToDefaultButton.addEventListener("click", () => {
    settingsModal.style.display = "none";
    textElements.forEach(element => {
        element.style.color = defaultValues[0];
    })
    textColor = defaultValues[0];
    backgroundElements.forEach(element => {
        element.style.backgroundColor = defaultValues[1];
    })
    backgroundElementsLighter.forEach(element => {
        element.style.backgroundColor = defaultValues[2];
    })
    textColorInput.value = defaultValues[0];
    bgColorInput.value = defaultValues[1];
    hideOnStartInput.checked = true;
    hideElementsOnStartTrue = true;
    localStorage.setItem("settings", { textColor: textColorInput.value, bgColor: bgColorInput.value, hideElementsOnStartTrue: hideElementsOnStartTrue });

})

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