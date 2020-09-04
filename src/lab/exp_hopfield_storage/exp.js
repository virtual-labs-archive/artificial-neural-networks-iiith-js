/* global stroke, line, noStroke, fill, LEFT, triangle */
/* global abs, rect, text, ellipse, mouseButton */
/* global mouseX, mouseY, textSize, noFill */
/* global cursor, CROSS, background, key */

// commit history is in the other repo, sorry :'(

// A ClASS FOR EVERY STATE AND THEIR ENERGY AS WELL AS RESPECTIVE POSITIONS IN ENERGY DIAGRAM
class StateElement {
  constructor() {
    this.printed = false;
    this.staTE = "";
    this.enerGY = 0;
    this.orDER = 0;
    this.stateCOX = 0;
    this.stateCOY = 0;
    this.selected = false;
  }
}

function deepCopy(arr) {
  if (Array.isArray(arr)) {
    return arr.map(x => deepCopy(x));
  }

  return arr;
}

function generator(rows, defValue) {
  const arr = [];

  arr.length = rows;
  for (let i = 0; i < rows; i++) {
    arr[i] = deepCopy(defValue);
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
  stateArr = stateGenerator(powUnits),
  binArr = stringGenerator(powUnits),
  stageOne = false,
  errorChoice = false,
  stageTwoShow = false,
  clickCount = 0,
  sA = stringGenerator(2),
  ss1 = stringGenerator(6),
  Arr1 = floatGenerator(6),
  secondTrack = false,
  stageThreeShow = false,
  weightA = float2DGenerator(3, 3),
  thresholdA = floatGenerator(3),
  probOFtr = float2DGenerator(8, 8),
  energyArr = floatGenerator(powUnits),
  orderSTATES = floatGenerator(powUnits),
  drawStartX = 800,
  drawStartY = 485;

// FOR ROUNDING OFF ENERGY VALUES
function Round(val, power) {
  const p = 10 ** power;
  val *= p;
  const tmp = Math.round(val);
  return tmp / p;
}

/**
 * @param {String} str
 */
function getBinArrayOfString(str) {
  return [...str].map(x => Number.parseInt(x, 10));
}

function createBottomTriangleDiagram() {
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

function drawDiagram() {
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

  const temp = getBinArrayOfString(sA[0]).concat(getBinArrayOfString(sA[1])),
    res = floatGenerator(6);

  res[0] = weightA[0][1] * temp[1] + weightA[0][2] * temp[2] - thresholdA[0];
  res[1] = weightA[1][0] * temp[0] + weightA[1][2] * temp[2] - thresholdA[1];
  res[2] = weightA[2][0] * temp[0] + weightA[2][1] * temp[1] - thresholdA[2];
  res[3] = weightA[0][1] * temp[4] + weightA[0][2] * temp[5] - thresholdA[0];
  res[4] = weightA[1][0] * temp[3] + weightA[1][2] * temp[5] - thresholdA[1];
  res[5] = weightA[2][0] * temp[3] + weightA[2][1] * temp[4] - thresholdA[2];

  for (let v = 0; v < 6; v++) {
    const satisfied =
      (temp[v] > 0 && res[v] > 0) || (temp[v] === 0 && res[v] <= 0);
    if (!satisfied) {
      return false;
    }
  }

  return true;
}

// Draws Lines Betweeen Energy States Showing Possible Transitions
function drawConnections(probOfTrTempp, tempStatesArr) {
  for (let outC = 0; outC < 8; outC++) {
    for (let inC = 0; inC < 8; inC++) {
      if (probOfTrTempp[outC][inC] > 0) {
        const stateI = tempStatesArr[outC],
          stateJ = tempStatesArr[inC];

        let n = 10 * (energyArr[outC] + energyArr[inC]);
        n += abs(stateI.stateCOX - stateJ.stateCOX) / 50;
        stroke(200, 200, 0);

        const point1 = [stateI.stateCOX, stateI.stateCOY + 25],
          point2 = [stateJ.stateCOX - 30 - n, stateI.stateCOY + 25],
          point3 = [stateJ.stateCOX - 30 - n, stateJ.stateCOY + 15],
          point4 = [stateJ.stateCOX, stateJ.stateCOY + 15];

        line(...point1, ...point2);
        line(...point2, ...point3);
        line(...point3, ...point4);
        fill(0);
        triangle(
          ...point4,
          stateJ.stateCOX - 10,
          stateJ.stateCOY,
          stateJ.stateCOX - 10,
          stateJ.stateCOY + 30
        );
        noFill();
        noStroke();
      }
    }
  }
}

/**
 * draws state transition diagram
 * @param {Array<StateElement>} stateArray
 * @param {Array<Number>} orderStates
 */
function drawEnergyDiagram(stateArray, orderStates) {
  for (let i = 0; i < orderStates.length; i++) {
    let drawStartXX = drawStartX,
      s = stateArray[i].staTE,
      // dicey: use getBinArray or not?
      tt = [...s].map(x => Number.parseInt(x, 10) - 48);

    const inVar = stateArray[i].orDER;
    let count = 0;
    for (const state of stateArray) {
      if (state.orDER === inVar) {
        // && stateARRR[y].printed==false)
        count++;
      }
    }
    drawStartXX -= 150 * count;
    fill(50);
    rect(drawStartXX, drawStartY - 65 * inVar, 107, 45);
    fill(255);
    textSize(15);

    text(tt[0], drawStartXX + 40, drawStartY - 65 * inVar + 18);
    text(tt[1], drawStartXX + 5, drawStartY - 65 * inVar + 34);
    text(tt[2], drawStartXX + 75, drawStartY - 65 * inVar + 34);

    text(
      `{${stateArray[i].enerGY}}`,
      drawStartXX + 24,
      drawStartY - 65 * inVar + 35
    );
    stateArray[i].stateCOX = drawStartXX;
    stateArray[i].stateCOY = drawStartY - 65 * inVar;
  }
}

// FINDING HAMMING DISTANCE BETWEEN TWO NODES, RETURN TRUE IF DIST IS ONE
function hammingDist(outC, inC) {
  let seen = false,
    c1 = binArr[outC],
    c2 = binArr[inC];

  for (let c = 0; c < c1.length; c++) {
    if (c1[c] !== c2[c]) {
      if (!seen) {
        seen = true;
      } else {
        return false;
      }
    }
  }
  return true;
}

// try to find the transition probabilities and make an entry to matrix
function callStateTransition(probOFtrT, energyArrR) {
  for (let outC = 0; outC < powUnits; outC++) {
    for (let inC = 0; inC < powUnits; inC++) {
      if (energyArrR[outC] >= energyArrR[inC] && hammingDist(outC, inC)) {
        probOFtrT[outC][inC] = 1;
      } else {
        probOFtrT[outC][inC] = 0;
      }
    }
  }
  for (let outC = 0; outC < powUnits; outC++) {
    let n = 0.0;
    for (let inC = 0; inC < powUnits; inC++) {
      n += probOFtrT[outC][inC];
    }
    if (n > 0 && n < 4) {
      n = Round(1 / n, 1);
    } else if (n === 4) {
      probOFtrT[outC][outC] = 0;
      n--;
      n = Round(1 / n, 1);
    }
    for (let inC = 0; inC < powUnits; inC++) {
      probOFtrT[outC][inC] *= n;
    }
  }
}

// ORDER OF THE DISPLAY
// TO SORT THE ENERGY ARRAY
function determineOrder(statesArray, energyArrR, orderStatesTemp) {
  energyArrR.sort((a, b) => a - b);

  for (let i = 0; i < powUnits; i++) {
    let count = 0;
    for (let j = 0; j < powUnits; j++) {
      if (statesArray[j].enerGY === energyArrR[i]) {
        statesArray[j].orDER = i;
        count++;
        if (count === 2) {
          i++;
        }
      }
    }
  }
  for (let t = 0; t < powUnits; t++) {
    orderStatesTemp[t] = statesArray[t].orDER;
  }
}

// CALCULATES ENERGY FOR EACH STATE INDIVIDUALLY
function calculateENERGY(cA) {
  let sumM = 0.0,
    sumN = 0.0,
    cABin = getBinArrayOfString(cA);

  for (let p = 0; p < nUnits; p++) {
    for (let q = 0; q < nUnits; q++) {
      sumM += weightA[p][q] * cABin[p] * cABin[q];
    }
    sumN += thresholdA[p] * cABin[p];
  }

  let enerGY = -0.5 * sumM + sumN;
  enerGY = Round(enerGY, 2);
  return enerGY;
}

// TAKES VALUES FROM binArr ONE BY ONE AND CALLS FOR ITS ENERGY
function callForEnergy() {
  for (let cc = 0; cc < powUnits; cc++) {
    stateArr[cc].enerGY = energyArr[cc] = calculateENERGY(binArr[cc]);
    // text(stateARR[cc].enerGY,200+50*cc,400);
  }
}

function newEnergyDiagram() {
  drawDiagram();
  weightA[0][0] = 0;
  weightA[0][1] = valA[0];
  weightA[0][2] = valA[2];
  weightA[1][0] = valA[0];
  weightA[1][1] = 0;
  weightA[1][2] = valA[1];
  weightA[2][0] = valA[2];
  weightA[2][1] = valA[1];
  weightA[2][2] = 0;
  for (let i = 0; i < 3; i++) {
    thresholdA[i] = valA[3 + i];
  }

  callForEnergy();
  callStateTransition(probOFtr, energyArr);
  determineOrder(stateArr, energyArr, orderSTATES);
  drawEnergyDiagram(stateArr, orderSTATES);
  drawConnections(probOFtr, stateArr);
  trackMouseMovement();
}

function drawOptions() {
  drawRectangles();
  trackMouseMove();

  if (errorChoice) {
    fill(0, 0, 255);
    textSize(16);
    text("Wrong choice: Press button to start again ", 170, 150);
    noFill();
    fill(50);
    rect(620, 130, 70, 25);
    fill(0);
    rect(623, 133, 64, 19);
    textSize(16);
    fill(255);
    text("Click", 630, 147);

    clickCount = 0;
    stageOne = false;
    for (let i = 0; i < 8; i++) {
      stateArr[i].selected = false;
    }
  }

  if (stageTwoShow && !stageThreeShow) {
    fill(0);
    textSize(16);
    const hint =
      "Hint: W12 = 0.5; W23 = 0.6; W31 = -0.5; Th1 = 0.4; Th2 = -0.6; Th3 = 0.5";
    text(hint, 15, 15);
    text(hint, 16, 15);
    textSize(18);
    text("Adjust the weights and thresholds for the new 'STD'", 130, 230);
    noFill();
    getStrings(sA[0], sA[1]);
    printEquations();

    for (let jj = 0; jj < 6; jj++) {
      fill(0);
      text(valA[jj], 600, 285 + 40 * jj);
      rect(350 + 200 * valA[jj], 270 + 40 * jj, 20, 10);
    }
    rect(670, 505, 100, 30);
    fill(200, 200, 0);
    rect(680, 510, 80, 20);
    fill(0);
    textSize(18);
    text("Done", 697, 527);
    rect(20, 505, 100, 30);
    fill(200, 200, 0);
    rect(30, 510, 80, 20);
    fill(0);
    textSize(18);
    text("Back", 47, 527);
  }
  if (!stageTwoShow && !stageThreeShow) {
    fill(0);
    textSize(16);
    const hint =
      "Hint: click on '011' and '110' to be represented as stable states";
    text(hint, 20, 23);
    text(hint, 21, 23);
    textSize(14);
    fill(0);
    textSize(16);
    // text("THIS IS THE SECOND PART OF THE EXPERIMENT", 170, 180);
    // text("MOVE THE MOUSE OVER THE STATES",240,180);
    text(
      "Click over the states to choose them as minimum energy states",
      110,
      210
    );
    text("You can choose at most two states as minimum", 180, 240);
    text(
      "Make sure they are separated by more than one hamming distance",
      100,
      270
    );
    createBottomTriangleDiagram();
  } else if (stageThreeShow) {
    resizeTo(800, 550);
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
      drawDiagram();
      textSize(20);
      text("Inequalities do not satisfy", 400, 300);
    }
  }
}

function drawRectangles() {
  // eslint-disable-next-line no-undef
  const forPosn = createCanvas(800, 600);
  // for_posn.position(windowWidth*0.07-20,windowHeight*0.2+50);
  forPosn.parent("flex-container");
  cursor(CROSS);
  background(120);
  // background(220, 180, 0);
  stroke(150, 120, 0);
  fill(170);
  rect(0, 30, 800, 510);
  const tempX = pivotX,
    tempY = pivotY;
  for (let i = 0; i < 8; i++) {
    if (!stateArr[i].selected) {
      fill(120);
    } else {
      fill(0, 0, 190);
    }

    rect(tempX + 100 * i, tempY, 75, 50);
    const cTEMP = binArr[i];
    if (!stateArr[i].selected) {
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
  if (!stageOne) {
    fill(0);
    rect(320, 295, 100, 30);
    fill(200, 200, 0);
    rect(330, 300, 80, 20);
    fill(0);
    textSize(18);
    text("Submit", 337, 317);
    textSize(14);
  }
}

function trackMouseMove() {
  if (!stageTwoShow && !stageThreeShow) {
    for (let i = 0; i < 8; i++) {
      if (
        mouseY - pivotY > 0 &&
        mouseY - pivotY < 50 &&
        mouseX - (pivotX + 100 * i) > 0 &&
        mouseX - (pivotX + 100 * i) < 75
      ) {
        fill(0, 0, 200);
        rect(pivotX + 100 * i, pivotY, 75, 50);
        const cTEMP = binArr[i];
        fill(255);
        text(cTEMP[0], pivotX + 100 * i + 35, pivotY + 15);
        text(cTEMP[1], pivotX + 100 * i + 10, pivotY + 30);
        text(cTEMP[2], pivotX + 100 * i + 60, pivotY + 30);
        noFill();
      }
    }
  }
}

/**
 * @param {Integer} num convert number [0,7] into binary string
 */
function binary(num) {
  let s = num.toString(2);

  if (s.length === 1) {
    s = `00${s}`;
  }
  if (s.length === 2) {
    s = `0${s}`;
  }
  return s;
}

// SETS THE INTEGER ARRAY binArr WITH BINARY VALUES
function setStates() {
  for (let cc = 0; cc < powUnits; cc++) {
    const s1 = binary(cc),
      s = new StateElement();
    s.staTE = s1;
    binArr[cc] = s1;
    stateArr[cc] = s;
  }
}

function showStageTwo() {
  let count = 0;
  for (let i = 0; i < 8; i++) {
    if (stateArr[i].selected) {
      sA[count] = stateArr[i].staTE;
      count++;
    }
  }
}

function trackMouseMovement() {
  for (let i = 0; i < powUnits; i++) {
    const cox = stateArr[i].stateCOX,
      coy = stateArr[i].stateCOY;

    if (
      mouseX - cox > 0 &&
      mouseX - cox < 90 &&
      mouseY - coy > 0 &&
      mouseY - coy < 45
    ) {
      const s = stateArr[i].staTE,
        tt = getBinArrayOfString(s);

      fill(0, 0, 205);
      rect(cox, coy, 90, 45);
      fill(255);
      textSize(15);
      text(tt[0], cox + 40, coy + 16);
      text(tt[1], cox + 5, coy + 30);
      text(tt[2], cox + 75, coy + 30);
      for (let ii = 0; ii < powUnits; ii++) {
        if (probOFtr[i][ii] > 0) {
          const s1 = stateArr[ii].staTE,
            tt1 = getBinArrayOfString(s1);

          fill(0, 0, 205);
          rect(stateArr[ii].stateCOX, stateArr[ii].stateCOY, 90, 45);
          fill(255);
          textSize(15);
          text(tt1[0], stateArr[ii].stateCOX + 40, stateArr[ii].stateCOY + 16);
          text(tt1[1], stateArr[ii].stateCOX + 5, stateArr[ii].stateCOY + 30);
          text(tt1[2], stateArr[ii].stateCOX + 75, stateArr[ii].stateCOY + 30);
          text(
            `{${probOFtr[i][ii]}}`,
            stateArr[ii].stateCOX + 24,
            stateArr[ii].stateCOY + 35
          );
          text(`{${probOFtr[i][i]}}`, cox + 24, coy + 35);

          let f = 10 * (energyArr[i] + energyArr[ii]);
          f += abs(cox - stateArr[ii].stateCOX) / 5;
          stroke(0, 0, 193);

          line(cox, coy + 25, stateArr[ii].stateCOX - 30 - f, coy + 25);
          line(cox, coy + 26, stateArr[ii].stateCOX - 30 - f, coy + 26);

          line(
            stateArr[ii].stateCOX - 30 - f,
            coy + 25,
            stateArr[ii].stateCOX - 30 - f,
            stateArr[ii].stateCOY + 15
          );
          line(
            stateArr[ii].stateCOX - 31 - f,
            coy + 25,
            stateArr[ii].stateCOX - 31 - f,
            stateArr[ii].stateCOY + 15
          );

          line(
            stateArr[ii].stateCOX - 30 - f,
            stateArr[ii].stateCOY + 15,
            stateArr[ii].stateCOX,
            stateArr[ii].stateCOY + 15
          );
          line(
            stateArr[ii].stateCOX - 30 - f,
            stateArr[ii].stateCOY + 14,
            stateArr[ii].stateCOX,
            stateArr[ii].stateCOY + 14
          );

          line(cox, coy + 26, stateArr[ii].stateCOX - 30 - f, coy + 26);
          line(
            stateArr[ii].stateCOX - 31 - f,
            coy + 25,
            stateArr[ii].stateCOX - 31 - f,
            stateArr[ii].stateCOY + 15
          );
          line(
            stateArr[ii].stateCOX - 30 - f,
            stateArr[ii].stateCOY + 16,
            stateArr[ii].stateCOX,
            stateArr[ii].stateCOY + 16
          );
        }
      }
    }
  }
}

// eslint-disable-next-line no-unused-vars
function mouseReleased() {
  // p5's own function for detecting clicks
  if (errorChoice) {
    if (mouseX > 620 && mouseX < 690 && mouseY > 120 && mouseY < 155) {
      errorChoice = false;
      stageOne = false;
      for (let i = 0; i < powUnits; i++) {
        if (i < 6) {
          valA[i] = 0;
        }
        stateArr[i].selected = false;
      }
    }
  }

  if (!stageOne) {
    for (let i = 0; i < powUnits; i++) {
      if (
        mouseButton === LEFT &&
        mouseY - pivotY > 0 &&
        mouseY - pivotY < 50 &&
        mouseX - (pivotX + 100 * i) > 0 &&
        mouseX - (pivotX + 100 * i) < 75
      ) {
        stateArr[i].selected = true;
      }
    }
    if (mouseX > 320 && mouseX < 420 && mouseY > 295 && mouseY < 325) {
      stageOne = true;
      validateInput();
      for (let i = 0; i < 6; i++) {
        valA[i] = 0;
      }
    }
  }

  if (secondTrack && !stageThreeShow) {
    for (let i = 0; i < 6; i++) {
      if (mouseY > 270 + 40 * i && mouseY < 280 + 40 * i) {
        for (let j = 0; j < 22; j++) {
          if (mouseX < 150 + 20 * j) {
            retainIndexes(i, j);
            break;
          }
        }
      }
    }
  }
  if (secondTrack && !stageThreeShow) {
    if (mouseX > 680 && mouseX < 760 && mouseY > 510 && mouseY < 530) {
      stageThreeShow = true;
    } else if (mouseX > 20 && mouseX < 120 && mouseY > 510 && mouseY < 530) {
      errorChoice = false;
      stageTwoShow = false;
      stageOne = false;
      clearAll();
    }
  }
  if (stageThreeShow) {
    if (mouseX > 40 && mouseX < 190) {
      if (mouseY > 380 && mouseY < 415) {
        stageThreeShow = false;
        stageTwoShow = true;
        for (let i = 0; i < 6; i++) {
          valA[i] = 0;
        }
      } else if (mouseY > 450 && mouseY < 485) {
        stageOne = false;
        stageThreeShow = false;
        stageTwoShow = false;
        for (let i = 0; i < 8; i++) {
          stateArr[i].selected = false;
        }
      }
    }
  }

  trackMouseMovement();
}

function clearAll() {
  clickCount = 0;
  for (let k = 0; k < 8; k++) {
    stateArr[k].selected = false;
  }
}

// eslint-disable-next-line no-unused-vars
function keyPressed() {
  if (key === "A" || key === "a") {
    errorChoice = false;
    for (let i = 0; i < 8; i++) {
      stateArr[i].selected = false;
    }
  }
}

function validateInput() {
  const iT = floatGenerator(2);
  for (let i = 0; i < 8; i++) {
    if (stateArr[i].selected) {
      clickCount++;
    }
  }
  if (clickCount !== 2) {
    errorChoice = true;
  } else {
    let ct = 0;
    for (let i = 0; i < 8; i++) {
      if (stateArr[i].selected) {
        iT[ct] = i;
        ct++;
      }
    }
    if (hammingDist(iT[0], iT[1])) {
      errorChoice = true;
    } else {
      errorChoice = false;
      stageTwoShow = true;
      showStageTwo();
    }
  }
}

// GET THE CHARACTERS AND SEND TO MAKE EQUATIONS
function getStrings(s1, s2) {
  const Arr1 = getBinArrayOfString(s1).concat(getBinArrayOfString(s2));

  stringSHOW(Arr1);
}
// PRlet THE INEQUALITIES
function stringSHOW(aA) {
  let te1, te2, te3;
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
function printEquations() {
  stroke(0);
  fill(120);
  // fill(220, 180, 0);
  rect(0, 120, 800, 80);
  fill(0);
  textSize(14);
  text("Equations", 10, 140);
  textSize(14);
  text(
    `The states choosen to have minimum energy are : ${sA[0]} & ${sA[1]}`,
    250,
    140
  );
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
  for (let i = 0; i < 6; i++) {
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
  secondTrack = true;
}

function retainIndexes(n, n2) {
  const n3 = (n2 - 11) / 10;
  mark[n] = true;
  valA[n] = n3;
  for (let c = 0; c < 6; c++) {
    if (mark[c] && c !== n) {
      textSize(20);
    }
  }
}

// DRAWS STATE TRANSITION DIAGRAM

// eslint-disable-next-line no-unused-vars
function setup() {
  pivotX = 10;
  pivotY = 60;
  setStates();
  drawOptions();
}

// eslint-disable-next-line no-unused-vars
function draw() {
  drawOptions();
}
