/* global stroke, line, noStroke, fill, LEFT, triangle */
/* global abs, rect, text, ellipse, mouseButton */
/* global size, mouseX, mouseY, textSize, noFill */
/* global cursor, CROSS, background, key, binary */

// commit history is in the other repo, sorry :'(

// A ClASS FOR EVERY STATE AND THEIR ENERGY AS WELL AS RESPECTIVE POSITIONS IN ENERGY DIAGRAM
class StateElement {
    constructor() {
        this.printed = false;
        this.staTE = ""; // useless value TODO
        this.enerGY = ""; // useless value TODO
        this.orDER = ""; // useless value TODO
        this.stateCOX = ""; // useless value TODO
        this.stateCOY = ""; // useless value TODO
        this.selected = ""; // useless value TODO
    }
}

function generator(rows, defValue) {
    const arr = [];

    arr.length = rows;
    for (let i = 0; i < rows; i++) {
        arr[i] = defValue;
    }

    return arr;
}

function boolGenerator(rows) {
    return generator(rows, false);
}
function floatGenerator(rows) {
    return generator(rows, 0);
}
function stringGenerator(rows) {
    return generator(rows, "");
}
function stateGenerator(rows) {
    return generator(rows, new StateElement());
}

function float2DGenerator(rows, cols) {
    return generator(rows, floatGenerator(cols));
}

const mark = boolGenerator(6),
    valA = floatGenerator(6),
    nUnits = 3,
    powUnits = 2 ** nUnits;

let pivotX,
    pivotY,
    stateARR = stateGenerator(powUnits),
    binArr = stringGenerator(powUnits),
    stageONE = false,
    errorCHIOCE = false,
    stageTWOshow = false,
    clickCount = 0,
    sA = stringGenerator(2),
    ss1 = stringGenerator(6),
    Arr1 = floatGenerator(6),
    secondTRACK = false,
    stageTHREEshow = false,
    weightA = float2DGenerator(3, 3),
    thresholdA = floatGenerator(3),
    probOFtr = float2DGenerator(8, 8),
    energyArr = floatGenerator(powUnits),
    orderSTATES = floatGenerator(powUnits),
    drawStartX = 600,
    drawStartY = 485;


function createDIAG() {
    fill(0, 0, 200);
    stroke(250, 240, 0);
    line(380, 380, 300, 480);
    line(380, 380, 460, 480);
    line(460, 480, 300, 480);
    stroke(150, 120, 0);
    ellipse(380, 380, 30, 30);
    ellipse(300, 480, 30, 30);
    ellipse(460, 480, 30, 30);
    noStroke();
    textSize(16);
    fill(255);
    text("1", 375, 385);
    text("2", 295, 485);
    text("3", 455, 485);
    noFill();
    textSize(14);
    fill(152, 0, 53);
    text("Threshold1", 335, 360);
    text("Threshold2", 256, 515);
    text("Threshold3", 420, 515);
    text("w13", 410, 410);
    text("=w31", 425, 425);
    text("w12", 315, 425);
    text("=w21", 285, 445);
    text("w23", 340, 475);
    text("=w23", 370, 475);
    noStroke();
}

// eslint-disable-next-line no-unused-vars
function setup() {
    pivotX = 10;
    pivotY = 60;
    setStates();
    drawOPTIONS();
    for (let g = 0; g < 6; g++) {
        mark[g] = false;
    }
}

// eslint-disable-next-line no-unused-vars
function draw() {
    loop();
}

function loop() {
    drawOPTIONS();
}

function drawOPTIONS() {
    drawRECTS();
    trackMOVEMENT();

    if (errorCHIOCE) {
        fill(0, 0, 255);
        textSize(16);
        text("< WRONG CHOICE::PRESS BUTTON TO ENTER AGAIN >", 170, 150);
        noFill();
        fill(50);
        rect(620, 130, 70, 25);
        fill(0);
        rect(623, 133, 64, 19);
        textSize(16);
        fill(255);
        text("CLICK", 630, 147);

        clickCount = 0;
        stageONE = false;
        for (let i = 0; i < 8; i += 1) {
            stateARR[i].selected = false;
        }
    }

    if (stageTWOshow && !stageTHREEshow) {
        fill(0);
        textSize(16);
        text("HINT-->> W12 = 0.5; W23 = 0.6; W31 = -0.5; Th1 = 0.4; Th2 = -0.6; Th3 = 0.5", 15, 15);
        text("HINT-->> W12 = 0.5; W23 = 0.6; W31 = -0.5; Th1 = 0.4; Th2 = -0.6; Th3 = 0.5", 16, 15);
        textSize(18);
        text("ADJUST THE WEIGHTS AND THRESHOLDS FOR THE NEW 'STD'", 130, 230);
        noFill();
        getStrings(sA[0], sA[1]);
        printEQUATIONS();
    }
    if (stageTWOshow && !stageTHREEshow) {
        for (let jj = 0; jj < 6; jj++) {
            fill(0);
            text(valA[jj], 600, 285 + 40 * jj);
            rect(350 + (200 * valA[jj]), 270 + 40 * jj, 20, 10);
        }
        rect(670, 505, 100, 30);
        fill(200, 200, 0);
        rect(680, 510, 80, 20);
        fill(0);
        textSize(18);
        text("DONE", 697, 527);
        rect(20, 505, 100, 30);
        fill(200, 200, 0);
        rect(30, 510, 80, 20);
        fill(0);
        textSize(18);
        text("BACK", 47, 527);
    }
    if (!stageTWOshow && !stageTHREEshow) {
        fill(0);
        textSize(16);
        text("HINT-->> CLICK ON '011' AND '110' TO BE REPRESENTED AS STABLE STATES", 20, 23);
        text("HINT-->> CLICK ON '011' AND '110' TO BE REPRESENTED AS STABLE STATES", 21, 23);
        textSize(14);
        fill(0);
        textSize(16);
        // text("THIS IS THE SECOND PART OF THE EXPERIMENT", 170, 180);
        // text("MOVE THE MOUSE OVER THE STATES",240,180);
        text("CLICK OVER THE STATES TO CHOOSE THEM AS MINIMUM ENERGY STATES", 110, 210);
        text("YOU CAN CHOOSE AT MOST TWO STATES AS MINIMUM", 180, 240);
        text("MAKE SURE THEY ARE SEPARATED BY MORE THAN ONE HAMMING DISTANCE", 100, 270);
        createDIAG();
    } else if (stageTHREEshow) {
        size(800, 550);
        cursor(CROSS);
        background(120);
        // background(220, 180, 0);
        fill(170);
        rect(0, 30, 800, 510);


        fill(200, 200, 0);
        rect(40, 380, 150, 35);
        rect(40, 450, 150, 35);
        fill(120);
        // fill(0, 200, 0);
        rect(43, 382, 144, 30);
        rect(43, 452, 144, 30);
        fill(0);
        textSize(14);
        text("Adjust Weights", 60, 400);
        text("Choose States", 60, 470);
        textSize(14);
        text("Return to select different Weight values", 15, 435);
        text("Return to choose different states", 15, 510);

        const flaggs = checkINEQ();
        if (flaggs) {
            newEnergyDiagram();
        } else {
            drawDIAG();
            textSize(20);
            text("INEQUALITIES DO NOT SATISFY", 400, 300);
        }
    }
}

function drawRECTS() {
    size(800, 550);
    cursor(CROSS);
    background(120);
    // background(220, 180, 0);
    stroke(150, 120, 0);
    fill(170);
    rect(0, 30, 800, 510);
    const tempX = pivotX,
        tempY = pivotY;
    for (let i = 0; i < 8; i += 1) {
        if (!stateARR[i].selected) {
            fill(120);
        } else {
            fill(0, 0, 190);
        }

        rect(tempX + 100 * i, tempY, 75, 50);
        const cTEMP = binArr[i].toCharArray();
        if (!stateARR[i].selected) {
            fill(0);
        } else {
            fill(255);
        }

        textSize(14);
        text(cTEMP[0], tempX + 100 * i + 35, tempY + 15);
        text(cTEMP[1], tempX + 100 * i + 10, tempY + 30);
        text(cTEMP[2], tempX + 100 * i + 60, tempY + 30);
        noFill();
    }
    if (!stageONE) {
        fill(0);
        rect(320, 295, 100, 30);
        fill(200, 200, 0);
        rect(330, 300, 80, 20);
        fill(0);
        textSize(18);
        text("SUBMIT", 337, 317);
        textSize(14);
    }
}

function trackMOVEMENT() {
    if (!stageTWOshow && !stageTHREEshow) {
        for (let i = 0; i < 8; i += 1) {
            if (mouseY - pivotY > 0 && mouseY - pivotY < 50 && mouseX - (pivotX + 100 * i) > 0 && mouseX - (pivotX + 100 * i) < 75) {
                fill(0, 0, 200);
                rect(pivotX + 100 * i, pivotY, 75, 50);
                const cTEMP = binArr[i].toCharArray();
                fill(255);
                text(cTEMP[0], pivotX + 100 * i + 35, pivotY + 15);
                text(cTEMP[1], pivotX + 100 * i + 10, pivotY + 30);
                text(cTEMP[2], pivotX + 100 * i + 60, pivotY + 30);
                noFill();
            }
        }
    }
}


// SETS THE INTEGER ARRAY binArr WITH BINARY VALUES
function setStates() {
    for (let cc = 0; cc < powUnits; cc++) {
        const s1 = binary(cc, 3),
            s = new StateElement();
        s.staTE = s1;
        binArr[cc] = s1;
        stateARR[cc] = s;
    }
}

function showStageTWO() {
    let count = 0;
    for (let i = 0; i < 8; i += 1) {
        if (stateARR[i].selected) {
            sA[count] = stateARR[i].staTE;
            count += 1;
        }
    }
}

// eslint-disable-next-line no-unused-vars
function mouseClicked() {
    if (errorCHIOCE) {
        if (mouseX > 620 && mouseX < 690 && mouseY > 120 && mouseY < 155) {
            errorCHIOCE = false;
            stageONE = false;
            for (let i = 0; i < 8; i++) {
                if (i < 6) {
                    valA[i] = 0;
                }
                stateARR[i].selected = false;
            }
        }
    }
    if (!stageONE) {
        for (let i = 0; i < 8; i += 1) {
            if (mouseButton === LEFT && mouseY - pivotY > 0 && mouseY - pivotY < 50 && mouseX - (pivotX + 100 * i) > 0 && mouseX - (pivotX + 100 * i) < 75) {
                stateARR[i].selected = true;
            }
        }
        if (mouseX > 320 && mouseX < 420 && mouseY > 295 && mouseY < 325) {
            stageONE = true;
            validateIPUT();
            for (let i = 0; i < 6; i += 1) {
                valA[i] = 0;
            }
        }
    }
    if (secondTRACK && !stageTHREEshow) {
        for (let i = 0; i < 6; i += 1) {
            if (mouseY > 270 + 40 * i && mouseY < 280 + 40 * i) {
                for (let j = 0; j < 22; j++) {
                    if (mouseX < 150 + 20 * j) {
                        reTAIN(i, j);
                        break;
                    }
                }
            }
        }
    }
    if (secondTRACK && !stageTHREEshow) {
        if (mouseX > 680 && mouseX < 760 && mouseY > 510 && mouseY < 530) {
            stageTHREEshow = true;
        } else if (mouseX > 20 && mouseX < 120 && mouseY > 510 && mouseY < 530) {
            errorCHIOCE = false;
            stageTWOshow = false;
            stageONE = false;
            clearALL();
        }
    }
    if (stageTHREEshow) {
        if (mouseX > 40 && mouseX < 190) {
            if (mouseY > 380 && mouseY < 415) {
                stageTHREEshow = false;
                stageTWOshow = true;
                for (let i = 0; i < 6; i += 1) {
                    valA[i] = 0;
                }
            } else if (mouseY > 450 && mouseY < 485) {
                stageONE = false;
                stageTHREEshow = false;
                stageTWOshow = false;
                for (let i = 0; i < 8; i += 1) {
                    stateARR[i].selected = false;
                }
            }
        }
    }
}

function clearALL() {
    clickCount = 0;
    for (let k = 0; k < 8; k += 1) {
        stateARR[k].selected = false;
    }
}

// eslint-disable-next-line no-unused-vars
function keyPressed() {
    if (key === "A" || key === "a") {
        errorCHIOCE = false;
        for (let i = 0; i < 8; i += 1) {
            stateARR[i].selected = false;
        }
    }
}

function validateIPUT() {
    const iT = floatGenerator(2);
    for (let i = 0; i < 8; i += 1) {
        if (stateARR[i].selected) {
            clickCount += 1;
        }
    }
    if (clickCount !== 2) {
        errorCHIOCE = true;
    } else {
        let ct = 0;
        for (let i = 0; i < 8; i += 1) {
            if (stateARR[i].selected) {
                iT[ct] = i;
                ct += 1;
            }
        }
        if (hamminDIST(iT[0], iT[1])) {
            errorCHIOCE = true;
        } else {
            errorCHIOCE = false;
            stageTWOshow = true;
            showStageTWO();
        }
    }
}

// GET THE CHARACTERS AND SEND TO MAKE EQUATIONS
function getStrings(s1, s2) {
    let tp = 0;

    for (let i = 0; i < 3; i++) {
        Arr1[i] = s1.charCodeAt(i) - 48;
        tp++;
    }
    for (let i = 0; i < 3; i++) {
        Arr1[tp] = s2.charCodeAt(i) - 48;
        tp++;
    }
    stringSHOW(Arr1);
}
// PRlet THE INEQUALITIES
function stringSHOW(aA) {
    let te1,
        te2,
        te3;
    te1 = "";
    te2 = "";
    te3 = "";
    //  ss1[0] = "W12*("+aA[1]+")+W13*("+aA[2]+")-th1";
    //  ss1[1] = "W21*("+aA[0]+")+W23*("+aA[2]+")-th2";
    //  ss1[2] = "W31*("+aA[0]+")+W32*("+aA[1]+")-th3";
    //  ss1[3] = "W12*("+aA[4]+")+W13*("+aA[5]+")-th1";
    //  ss1[4] = "W21*("+aA[3]+")+W23*("+aA[5]+")-th2";
    //  ss1[5] = "W31*("+aA[3]+")+W32*("+aA[4]+")-th3";

    ss1[0] = `W12*(${aA[1]})+W13*(${aA[2]})`;
    ss1[1] = `W21*(${aA[0]})+W23*(${aA[2]})`;
    ss1[2] = `W31*(${aA[0]})+W32*(${aA[1]})`;
    ss1[3] = `W12*(${aA[4]})+W13*(${aA[5]})`;
    ss1[4] = `W21*(${aA[3]})+W23*(${aA[5]})`;
    ss1[5] = `W31*(${aA[3]})+W32*(${aA[4]})`;

    if (aA[0] !== 0) {
        te1 = ">th1";
    }
    if (aA[0] === 0) {
        te1 = "<=th1";
    }
    if (aA[1] !== 0) {
        te2 = ">th2";
    }
    if (aA[1] === 0) {
        te2 = "<=th2";
    }
    if (aA[2] !== 0) {
        te3 = ">th3";
    }
    if (aA[2] === 0) {
        te3 = "<=th3";
    }
    ss1[0] = ss1[0].concat(te1);
    ss1[1] = ss1[1].concat(te2);
    ss1[2] = ss1[2].concat(te3);
    if (aA[3] !== 0) {
        te1 = ">th1";
    } else if (aA[3] === 0) {
        te1 = "<=th1";
    }
    if (aA[4] !== 0) {
        te2 = ">th2";
    } else if (aA[4] === 0) {
        te2 = "<=th2";
    }
    if (aA[5] !== 0) {
        te3 = ">th3";
    } else if (aA[5] === 0) {
        te3 = "<=th3";
    }
    ss1[3] = ss1[3].concat(te1);
    ss1[4] = ss1[4].concat(te2);
    ss1[5] = ss1[5].concat(te3);
}

// ///PRINTS THE EQUATIONS ON THE SCREEN
function printEQUATIONS() {
    stroke(0);
    fill(120);
    // fill(220, 180, 0);
    rect(0, 120, 800, 80);
    fill(0);
    textSize(14);
    text("EQUATIONS", 10, 140);
    textSize(14);
    text(`THE STATES CHOOSEN TO HAVE MINIMUM ENERGY ARE : ${sA[0]} & ${sA[1]}`, 250, 140);
    textSize(15);
    for (let tt = 0; tt < 2; tt++) {
        fill(255);
        rect(120, 150 + 20 * tt, 220, 20);
        rect(120 + 220, 150 + 20 * tt, 220, 20);
        rect(120 + 440, 150 + 20 * tt, 220, 20);
    }
    fill(0);
    text(`Eqn. for ${sA[0]}`, 20, 165);
    text(`Eqn. for ${sA[1]}`, 20, 185);
    for (let coun = 0; coun < 2; coun++) {
        for (let j = 0; j < 3; j++) {
            fill(0);
            text(ss1[3 * coun + j], 130 + 220 * j, 165 + 20 * coun);
        }
    }
    giveSLIDERS();
    noStroke();
}

// HARD CODED VALUES
function giveSLIDERS() {
    // 250-550
    textSize(15);
    text("W12 = W21", 50, 280);
    text("W23 = W32", 50, 320);
    text("W31 = W13", 50, 360);
    text("Threshold1", 50, 400);
    text("Threshold2", 50, 440);
    text("Threshold3", 50, 480);
    // the main area
    for (let i = 0; i < 6; i += 1) {
    // fill(200, 20*i, 40);
        fill(120);
        rect(150, 270 + 40 * i, 420, 10);
        for (let j = 0; j < 22; j++) {
            fill(150);
            line(150 + 20 * j, 270 + 40 * i, 150 + 20 * j, 285 + 40 * i);
        }
    }
    // the markers
    line(150, 260, 150, 480);
    line(350, 260, 350, 480);
    line(370, 260, 370, 480);
    line(570, 260, 570, 480);
    // the texts
    fill(0);
    text("-1.0", 145, 500);
    text("0", 355, 500);
    text("1.0", 565, 500);
    secondTRACK = true;
}


function reTAIN(jj, ii) {
    let tt = 0.0;
    tt = ii;
    tt = (tt - 11) / 10;
    mark[jj] = true;
    valA[jj] = tt;
    for (let c = 0; c < 6; c++) {
        if (mark[c] && c !== jj) {
            textSize(20);
        }
    }
}

function newEnergyDiagram() {
    drawDIAG();
    weightA[0][0] = 0;
    weightA[0][1] = valA[0];
    weightA[0][2] = valA[2];
    weightA[1][0] = valA[0];
    weightA[1][1] = 0;
    weightA[1][2] = valA[1];
    weightA[2][0] = valA[2];
    weightA[2][1] = valA[1];
    weightA[2][2] = 0;
    for (let i = 0; i < 3; i += 1) {
        thresholdA[i] = valA[3 + i];
    }

    callForEnergy();
    calSTTtrsn(probOFtr, energyArr);
    determineORDER(stateARR, energyArr, orderSTATES);
    drawENERGYdiagram(stateARR, orderSTATES);
    drawCONNECIONS(probOFtr, stateARR);
    trackMOUSEmovement();
}


// CALCULATES ENERGY FOR EACH STATE INDIVIDUALLY
function calculateENERGY(cA) {
    let summ = 0.0,
        sumn = 0.0,
        enerGY,
        temp = floatGenerator(3);
    for (let inVar = 0; inVar < cA.length; inVar++) {
        temp[inVar] = Number.parseInt(cA[inVar], 10) - 48;
    }
    for (let p = 0; p < nUnits; p++) {
        for (let q = 0; q < nUnits; q++) {
            summ += weightA[p][q] * temp[p] * temp[q];
            // text(summ,200+40*p,400+30*q);
        }
        sumn += thresholdA[p] * temp[p];
    }
    enerGY = (-0.5 * summ) + sumn;
    enerGY = Round(enerGY, 2);
    // text(enerGY,200,400);
    return (enerGY);
}
// FOR ROUNDING OFF ENERGY VALUES
function Round(Rval, Rpl) {
    const p = 10 ** Rpl;
    Rval *= p;
    const tmp = Math.round(Rval);
    return tmp / p;
}
// TAKES VALUES FROM binArr ONE BY ONE AND CALLS FOR ITS ENERGY
function callForEnergy() {
    for (let cc = 0; cc < powUnits; cc++) {
        const cA = binArr[cc].toCharArray();
        energyArr[cc] = calculateENERGY(cA);
        stateARR[cc].enerGY = energyArr[cc];
    // text(stateARR[cc].enerGY,200+50*cc,400);
    }
}
// FINDING HAMMING DISTANCE BETWEEN TWO NODES, RETURN TRUE IF DIST IS ONE
function hamminDIST(outC, inC) {
    let coun = 0,
        c1 = binArr[outC].toCharArray(),
        c2 = binArr[inC].toCharArray();
    for (let c = 0; c < c1.length; c++) {
        if (c1[c] !== c2[c]) {
            coun++;
        }
    }
    if (coun < 2) {
        return true;
    }

    return false;
}

// TRY TO FIND THE TRANSITION PROBABILITIES AND MAKE AN ENTRY TO MATRIX
function calSTTtrsn(probOFtrT, energyArrR) {
    for (let outC = 0; outC < 8; outC++) {
        for (let inC = 0; inC < 8; inC++) {
            if (energyArrR[outC] >= energyArrR[inC] && hamminDIST(outC, inC)) {
                probOFtrT[outC][inC] = 1;
            } else {
                probOFtrT[outC][inC] = 0;
            }
        }
    }
    for (let outC = 0; outC < 8; outC++) {
        let tt = 0.0;
        for (let inC = 0; inC < 8; inC++) {
            tt += probOFtrT[outC][inC];
        }
        if (tt > 0 && tt < 4) {
            tt = 1 / tt;
            tt = Round(tt, 1);
        } else if (tt > 0 && tt === 4) {
            tt--;
            probOFtrT[outC][outC] = 0;
            tt = 1 / tt;
            tt = Round(tt, 1);
        }
        for (let inC = 0; inC < 8; inC++) {
            probOFtrT[outC][inC] *= tt;
        }
    }
}
// ORDER OF THE DISPLAY
function determineORDER(stateARRR, energyArrR, orderSTATEStemp) {
    // TO SORT THE ENERGY ARRAY
    let mirrorArr = floatGenerator(powUnits);
    mirrorArr = energyArrR;
    mirrorArr.sort();
    for (let i = 0; i < powUnits; i++) {
        let count = 0;
        for (let j = 0; j < powUnits; j++) {
            if (stateARRR[j].enerGY === mirrorArr[i]) {
                stateARRR[j].orDER = i;
                count++;
                if (count === 2) {
                    i++;
                }
            }
        }
    }
    for (let t = 0; t < 8; t++) {
        orderSTATEStemp[t] = stateARRR[t].orDER;
    }
}


// Draws Lines Betweeen Energy States Showing Possible Transitions
function drawCONNECIONS(probOFtrTEMPP, TEMPstatesARR) {
    for (let outC = 0; outC < 8; outC++) {
        for (let inC = 0; inC < 8; inC++) {
            if (probOFtrTEMPP[outC][inC] > 0) {
                let f = 10 * (energyArr[outC] + energyArr[inC]);
                f += abs(TEMPstatesARR[outC].stateCOX - TEMPstatesARR[inC].stateCOX) / 5;
                stroke(200, 200, 0);
                line(TEMPstatesARR[outC].stateCOX, TEMPstatesARR[outC].stateCOY + 25, TEMPstatesARR[inC].stateCOX - 30 - f, TEMPstatesARR[outC].stateCOY + 25);
                line(TEMPstatesARR[inC].stateCOX - 30 - f, TEMPstatesARR[outC].stateCOY + 25, TEMPstatesARR[inC].stateCOX - 30 - f, TEMPstatesARR[inC].stateCOY + 15);
                line(TEMPstatesARR[inC].stateCOX - 30 - f, TEMPstatesARR[inC].stateCOY + 15, TEMPstatesARR[inC].stateCOX, TEMPstatesARR[inC].stateCOY + 15);
                fill(0);
                triangle(TEMPstatesARR[inC].stateCOX, TEMPstatesARR[inC].stateCOY + 15, TEMPstatesARR[inC].stateCOX - 10, TEMPstatesARR[inC].stateCOY, TEMPstatesARR[inC].stateCOX - 10, TEMPstatesARR[inC].stateCOY + 30);
                noFill();
                noStroke();
            }
        }
    }
}


// DRAWS STATE TRANSITION DIAGRAM


// DRAWS STATE TRANSITION DIAGRAM
function drawENERGYdiagram(stateARRR, orderSTATESS) {
    let count = 1;
    for (let i = 0; i < orderSTATESS.length; i++) {
        let drawStartXX = drawStartX,
            s = stateARRR[i].staTE,
            tt = floatGenerator(3),
            cTEMP = s.toCharArray();
        for (let iC = 0; iC < 3; iC++) {
            tt[iC] = Number.parseInt(cTEMP[iC], 10) - 48;
        }
        const inVar = stateARRR[i].orDER;
        count = 0;
        for (let y = 0; y < i; y++) {
            if (stateARRR[y].orDER === inVar) { // && stateARRR[y].printed==false)
                count++;
            }
        }
        drawStartXX -= 150 * (count);
        fill(50);
        rect(drawStartXX, drawStartY - (65 * inVar), 90, 45);
        fill(255);
        textSize(15);

        text(tt[0], drawStartXX + 40, drawStartY - (65 * inVar) + 18);
        text(tt[1], drawStartXX + 5, (drawStartY - (65 * inVar)) + 34);
        text(tt[2], drawStartXX + 75, (drawStartY - (65 * inVar)) + 34);

        text(`{${stateARRR[i].enerGY}}`, drawStartXX + 24, (drawStartY - (65 * inVar)) + 35);
        stateARRR[i].stateCOX = drawStartXX;
        stateARRR[i].stateCOY = drawStartY - (65 * inVar);
        drawStartXX = drawStartX;
    }
}


function drawDIAG() {
    fill(0, 0, 200);
    stroke(250, 240, 0);
    line(180, 200, 100, 300);
    line(180, 200, 260, 300);
    line(260, 300, 100, 300);
    stroke(150, 120, 0);
    ellipse(180, 200, 30, 30);
    ellipse(100, 300, 30, 30);
    ellipse(260, 300, 30, 30);
    noStroke();
    textSize(16);
    fill(255);
    text("1", 175, 205);
    text("2", 95, 305);
    text("3", 255, 305);
    noFill();
    textSize(14);
    fill(152, 0, 53);
    text(`Threshold=${valA[3]}`, 135, 180);
    text(`Threshold=${valA[4]}`, 56, 335);
    text(`Threshold=${valA[5]}`, 220, 335);
    text(valA[2], 210, 235);
    text(valA[0], 105, 235);
    text(valA[1], 150, 295);
    noStroke();
}


// Checks the entered inqualities
function checkINEQ() {
    weightA[0][0] = 0;
    weightA[0][1] = valA[0];
    weightA[0][2] = valA[2];
    weightA[1][0] = valA[0];
    weightA[1][1] = 0;
    weightA[1][2] = valA[1];
    weightA[2][0] = valA[2];
    weightA[2][1] = valA[1];
    weightA[2][2] = 0;
    thresholdA[0] = valA[3];
    thresholdA[1] = valA[4];
    thresholdA[2] = valA[5];

    let answer = false,
        temp = floatGenerator(6),
        res = floatGenerator(6);
    for (let i = 0; i < 3; i++) {
        temp[i] = sA[0].charCodeAt(i) - 48;
        temp[3 + i] = sA[1].charCodeAt(i) - 48;
    }

    res[0] = weightA[0][1] * temp[1] + weightA[0][2] * temp[2] - thresholdA[0];
    res[1] = weightA[1][0] * temp[0] + weightA[1][2] * temp[2] - thresholdA[1];
    res[2] = weightA[2][0] * temp[0] + weightA[2][1] * temp[1] - thresholdA[2];
    res[3] = weightA[0][1] * temp[4] + weightA[0][2] * temp[5] - thresholdA[0];
    res[4] = weightA[1][0] * temp[3] + weightA[1][2] * temp[5] - thresholdA[1];
    res[5] = weightA[2][0] * temp[3] + weightA[2][1] * temp[4] - thresholdA[2];
    let oun = 0;
    for (let v = 0; v < 6; v++) {
        if ((temp[v] > 0 && res[v] > 0) || (temp[v] === 0 && res[v] <= 0)) {
            oun += 1;
        }
    }
    if (oun === 6) {
        answer = true;
    }

    return answer;
}


function trackMOUSEmovement() {
    for (let i = 0; i < 8; i += 1) {
        if (mouseX - stateARR[i].stateCOX > 0 && mouseX - stateARR[i].stateCOX < 90 && mouseY - stateARR[i].stateCOY > 0 && mouseY - stateARR[i].stateCOY < 45) {
            const s = stateARR[i].staTE,
                tt = floatGenerator(3);
            for (let iC = 0; iC < 3; iC++) {
                tt[iC] = s.charCodeAt(iC) - 48;
            }

            fill(0, 0, 205);
            rect(stateARR[i].stateCOX, stateARR[i].stateCOY, 90, 45);
            fill(255);
            textSize(15);
            text(tt[0], stateARR[i].stateCOX + 40, stateARR[i].stateCOY + 16);
            text(tt[1], stateARR[i].stateCOX + 5, stateARR[i].stateCOY + 30);
            text(tt[2], stateARR[i].stateCOX + 75, stateARR[i].stateCOY + 30);
            for (let ii = 0; ii < 8; ii += 1) {
                if (probOFtr[i][ii] > 0) {
                    const s1 = stateARR[ii].staTE,
                        tt1 = floatGenerator(3);
                    for (let iC = 0; iC < 3; iC++) {
                        tt1[iC] = s1.charCodeAt(iC) - 48;
                    }

                    fill(0, 0, 205);
                    rect(stateARR[ii].stateCOX, stateARR[ii].stateCOY, 90, 45);
                    fill(255);
                    textSize(15);
                    text(tt1[0], stateARR[ii].stateCOX + 40, stateARR[ii].stateCOY + 16);
                    text(tt1[1], stateARR[ii].stateCOX + 5, stateARR[ii].stateCOY + 30);
                    text(tt1[2], stateARR[ii].stateCOX + 75, stateARR[ii].stateCOY + 30);
                    text(`{${probOFtr[i][ii]}}`, stateARR[ii].stateCOX + 24, stateARR[ii].stateCOY + 35);
                    text(`{${probOFtr[i][i]}}`, stateARR[i].stateCOX + 24, stateARR[i].stateCOY + 35);


                    let f = 10 * (energyArr[i] + energyArr[ii]);
                    f += abs(stateARR[i].stateCOX - stateARR[ii].stateCOX) / 5;
                    stroke(0, 0, 193);

                    line(stateARR[i].stateCOX, stateARR[i].stateCOY + 25, stateARR[ii].stateCOX - 30 - f, stateARR[i].stateCOY + 25);
                    line(stateARR[i].stateCOX, stateARR[i].stateCOY + 26, stateARR[ii].stateCOX - 30 - f, stateARR[i].stateCOY + 26);

                    line(stateARR[ii].stateCOX - 30 - f, stateARR[i].stateCOY + 25, stateARR[ii].stateCOX - 30 - f, stateARR[ii].stateCOY + 15);
                    line(stateARR[ii].stateCOX - 31 - f, stateARR[i].stateCOY + 25, stateARR[ii].stateCOX - 31 - f, stateARR[ii].stateCOY + 15);


                    line(stateARR[ii].stateCOX - 30 - f, stateARR[ii].stateCOY + 15, stateARR[ii].stateCOX, stateARR[ii].stateCOY + 15);
                    line(stateARR[ii].stateCOX - 30 - f, stateARR[ii].stateCOY + 14, stateARR[ii].stateCOX, stateARR[ii].stateCOY + 14);


                    line(stateARR[i].stateCOX, stateARR[i].stateCOY + 26, stateARR[ii].stateCOX - 30 - f, stateARR[i].stateCOY + 26);
                    line(stateARR[ii].stateCOX - 31 - f, stateARR[i].stateCOY + 25, stateARR[ii].stateCOX - 31 - f, stateARR[ii].stateCOY + 15);
                    line(stateARR[ii].stateCOX - 30 - f, stateARR[ii].stateCOY + 16, stateARR[ii].stateCOX, stateARR[ii].stateCOY + 16);
                }
            }
        }
    }
}
