const bgColorInput = document.querySelector("#bgColorInput");
const textColorInput = document.querySelector("#textColorInput");

const settingsApplyButton = document.querySelector("#settingsApplyButton");
const resetToDefaultButton = document.querySelector("#resetToDefaultButton");


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
];


const backgroundElements = [
    document.body,
    document.querySelector(".plus2-btn"),
    document.querySelector(".dnf-btn"),
    document.querySelector(".x-btn"),
    document.querySelector(".choose-round-finish-container"),

];
const backgroundElementsLighter= [
    document.querySelector("#sidebar"),
    document.querySelector("#openSideBar"),
    document.querySelector(".modal-container"),
    document.querySelector(".plus2-btn"),
    document.querySelector(".dnf-btn"),
    document.querySelector(".x-btn"),

];

settingsApplyButton.addEventListener("click", () => {
    textColor = textColorInput.value;
    bgColor = bgColorInput.value;
    console.log("vredniost " + bgColorInput.value);
    document.body.style.backgroundColor = bgColorInput.value;
    backgroundElements.forEach(element => {
        element.style.backgroundColor = bgColorInput.value;
    })
    backgroundElementsLighter.forEach(element => {
        console.log(lightenDarkenColor(bgColorInput.value, 30));
        element.style.backgroundColor = lightenDarkenColor(bgColorInput.value, 30);
    })
    textElements.forEach(element => {
        element.style.color = textColorInput.value;
    })
})

resetToDefaultButton.addEventListener("click", () => {
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
    
})

function lightenDarkenColor(col, amt) {
    let usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    let num = parseInt(col,16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}