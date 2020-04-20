window.EXP_NAME = "clnn";
const map_arr = {1: "2D-2D"};
const region_arr = {1: "Square", 2: "Circle", 3: "Triangle"};
const numDataPoints_arr = {100: "100", 300: "300", 1000: "1000"};
const numIterations_arr = {20: "20", 50: "50", 100: "100"};

const typeOfMapping = 1;
const regionType = 1;
const numIterations = 20;
const numDataPoints = 100;
const NIstep = 1;

let isSetGen = true;

function jssetgenflag() {
    isSetGen = true;
}

function jssetiternflag() {
    isSetGen = false;
}

window.extraArgs = function () {
    return {type: isSetGen ? "1" : "0", inputDim: "2"};
};
window.appenditure = {
    "mapping": map_arr,
    "region": region_arr,
    "numDataPoints": numDataPoints_arr,
    "numIterations": numIterations_arr
};


window.otherSetters = {NIstep};
