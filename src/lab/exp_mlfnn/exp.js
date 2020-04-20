window.EXP_NAME = "mlfnn";
const numberOfBits = {
        2: "2-bit XOR",
        3: "3-bit XOR", 4: "4-bit XOR", "-1":
            "Linearly separable", "-2":
            "Linearly inseparable"
    },
    numberOfhiddenNodes = {2: "2", 3: "3", 4: "4", 6: "6", 8: "8", 10: "10", 15: "15", 25: "25"};

let isTrain = true;

window.extraArgs = function(){
    return {isTrain: isTrain ? "1" : "0"};
};

/**
 * @param type {String}
 */
function setType(type) {
    isTrain = type === "train";
}

window.appenditure = {
    "numberOfBits": numberOfBits,
    "numberOfhiddenNodes": numberOfhiddenNodes
};
