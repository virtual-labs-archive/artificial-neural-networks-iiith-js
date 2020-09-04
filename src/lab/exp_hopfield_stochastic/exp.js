function dec2bin(dec){
    return (dec >>> 0).toString(2);
}
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

let tempCount=0,
    tempVAL = new createArray(20),
    co =0,
    negCount = 0,
    fmatCount = 0,
    yCR= 100,
    FMAT= new createArray(20,8),
    pMatrix = new createArray(8),
    tStart = 1.0,
    tTemp,
    check = false,
    startX, startY,
    rad =40,
    nUnits = 3,
    drawStartX = 700, //650; 
    drawStartY = 540,
    probOFtr = new createArray(8,8),
    binArr = new createArray(Math.pow(2, nUnits)),
    energyArr = new createArray(Math.pow(2, nUnits)),
    stateARR = new createArray(Math.pow(2, nUnits)),
    orderSTATES = new createArray(Math.pow(2, nUnits)),
    weightA,
    thresholdA,
    cenArr = new createArray(nUnits,2),
    probTRANS = new createArray(8,8),
    clickFLAG = false,
    clickVALX = 27,
    clickVALY = 0,
    temprature=0.0,
    clickX;
function setup()
{
  const canvas = createCanvas(800, 600);
  canvas.parent("flex-container");
  canvas.style("visibility", "visible");
  cursor(CROSS);
  background(220, 180, 0);
  fill(120);
  rect(0, 75, 800, 550);
  stroke(120);
  rect(600, 0, 200, 75);
  initLZE();
  createBACK();
  setStates();
  callForEnergy();
  determineORDER(stateARR, energyArr, orderSTATES);
  drawENERGYdiagram(stateARR, orderSTATES);
  drawCONNECIONS(probTRANS, stateARR);
  fill(0);
  tTemp = 1.0;
}

function draw()
{
  looper();
  annealPART();
  if (check==true)
  {
    makeClickedRect(yCR);
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function looper()
{
  fill(120);
  rect(0, 0, 800, 600);
  createBACK();
  drawENERGYdiagram(stateARR, orderSTATES);

  ask(probTRANS);

  drawCONNECIONS(probTRANS, stateARR);
  track();
  markIT();
  printPROBmat();
  showTempInOne(clickVALX, clickVALY);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ask(probTRANS)
{
  if (temprature==0.0)
  {
    for (let i=0;i<8;i++)
    {
      for (let j=0;j<8;j++)
      {
        probTRANS[i][j] = 0.0;
      }
    }

    probTRANS[0][0] = Round(0.33, 2);
    probTRANS[0][2] = 0.33;
    probTRANS[0][4] = 0.33;
    probTRANS[1][0] = 0.33;
    probTRANS[1][3] = 0.33;
    probTRANS[1][5] = 0.33;
    probTRANS[3][2] = 0.33;
    probTRANS[3][3] = 0.33;
    probTRANS[3][7] = 0.33;
    probTRANS[5][4] = 0.33;
    probTRANS[5][5] = 0.33;
    probTRANS[5][7] = 0.33;
    probTRANS[6][2] = 0.33;
    probTRANS[6][4] = 0.33;
    probTRANS[6][7] = 0.33;
    probTRANS[2][2] = 1.0;
    probTRANS[4][4] = 1.0;
    probTRANS[7][7] = 1.0;
  }
  else
  {
    //System.out.println();
    for (let j1=0;j1<8;j1++)
    {
      for (let j2=0;j2<8;j2++)
      {
        probTRANS[j1][j2] = 0.0;
      }
    }

    for (let t=0;t<8;t++)
    {
      let s = binArr[t];
     let dTEMP = probFIRE(t, s, temprature);
      for (let i=0;i<8;i++)
      {
        probTRANS[t][i] = RoundA(dTEMP[i], 3);
      }
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//getting a state seq in form of an integer array out of a number 
function getArrayOfState(p)
{
  let temp = new createArray(3);
  let s= binArr[p];
  let c1 = s.split("");
  for (let ina = 0;ina<c1.length;ina++) { 
    temp[ina] = (c1[ina].charCodeAt(0)) - 48;
  }
  return temp;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FINDING THE PROBABILITY TO FIRE FOR A GIVEN TEMPRATURE
function probFIRE(i1, s, temprature)
{
  let probARR = new createArray(4);
  let activationArr = new createArray(3);
  let activation = 0.0;
  let power=  new createArray(binArr.length);

  // NOW WE HAVE THE ACTIVATION VALUES FOR RESPECTIVE NODES, WE'd CALCULATE THE PROBABILITY OF FIRING
  let temp = getArrayOfState(i1);
  activationArr = giveActivation(s);
  let stringNUM = i1;
  for (let i=0;i<3;i++)
  {
    probARR[i] = (1/(1+Math.exp(-(activationArr[i]/temprature))));
    probARR[i] = RoundA(probARR[i], 3);
    //      System.out.print("~~~>"+probARR[i]);
  }
  //  System.out.println();

  // CHECKING TRANSITION PROBABILITIES WITH REST OF THE STATES
  for (let j=0;j<binArr.length;j++)
  {
    let cc = false;
    if (hamminDIST(j, stringNUM))
    {
      let order=-1;
      let iT = getArrayOfState(j);
      //System.out.println("~~~>"+iT[0]+iT[1]+iT[2]+"<~~~~>"+temp[0]+temp[1]+temp[2]);

      if (iT[0]!=temp[0] && iT[1]==temp[1] && iT[2]==temp[2])
      {
        order = 0;
        if (temp[0] == 1) {
          cc = true;
        }
      }
      else if (iT[0]==temp[0] && iT[1]!=temp[1] && iT[2]==temp[2])
      {
        order = 1; 
        if (temp[1] == 1) {
          cc = true;
        }
      }
      else if (iT[0]==temp[0] && iT[1]==temp[1] && iT[2]!=temp[2])
      {
        order = 2;
        if (temp[2] == 1) {
          cc = true;
        }
      }
      else if (iT[0]==temp[0] && iT[1]==temp[1] && iT[2]==temp[2])
      {
        order = 3;
      }
      else
      {
        order = -1;
      }

      if (order>-1 && order<3 && cc==false)
      {
        power[j] = (1-probARR[order])/3;
      }
      else if (order>-1 && order<3 && cc== true)
      {
        power[j] = probARR[order]/3;
      }
      else
      {
        power[j] = 0.0;
      }
    }
    else
    {
      power[j] = 0.0;
    }
  }
  let ssum=0.0;
  for (let o=0;o<8;o+=1)
  {
    ssum = ssum+power[o];
  }
  power[i1] = 1.0-ssum;
  return power;
}
// FOR ROUNDING OFF DOUBLE VALUES
function RoundA(Rval, Rpl) {
  let p = parseFloat(Math.pow(10, Rpl)) || 0;
  Rval = Rval * p;
  let tmp = Math.round(Rval);
  return parseFloat(tmp/p) || 0;
}





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Takes input as string State and return 3 activation values as output corresponding to three nodes

function giveActivation(ss1)
{
  let activation = 0.0;
  let arrAct = new createArray(3);
  let temp = new createArray(3);
  //converting the input state to char array which then converts to int array.. 
  let c1 = ss1.split('');
  for (let ina=0;ina<c1.length;ina++) 
  { 
    temp[ina]=(c1[ina].charCodeAt(0))-48;
  }
  //calculating the activation by summing the weights multiplied by the states
  for (let out=0;out<3;out++)
  {  
    activation=0.0;
    for (let ina=0;ina<3;ina++)
    {
      activation = activation + weightA[out][ina]*temp[ina];
    }
    arrAct[out] = activation;
  }
  //subtracting the threshold
  for (let i=0;i<3;i++)
  {
    arrAct[i] = arrAct[i] - thresholdA[i];
  }
  return arrAct;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function track()
{
  for (let i=0;i<8;i++)
  {
    if (mouseX>stateARR[i].stateCOX && mouseX<stateARR[i].stateCOX+90 && mouseY>stateARR[i].stateCOY && mouseY<stateARR[i].stateCOY+55)
    {
      for (let oc=0;oc<stateARR.length;oc++)
      {

        if (probTRANS[i][oc]>0)
        {
          let f = 10*(energyArr[i]+energyArr[oc]);
          f = f + abs(stateARR[i].stateCOX - stateARR[oc].stateCOX)/5;
          stroke(0, 0, 200);
          line(stateARR[i].stateCOX, stateARR[i].stateCOY+30, stateARR[oc].stateCOX-30-f, stateARR[i].stateCOY+30);
          line(stateARR[oc].stateCOX-30-f, stateARR[i].stateCOY+30, stateARR[oc].stateCOX-30-f, stateARR[oc].stateCOY+15);
          line(stateARR[oc].stateCOX-30-f, stateARR[oc].stateCOY+15, stateARR[oc].stateCOX, stateARR[oc].stateCOY+15);
          stroke(0, 200, 0);

          fill(200, 150, 0);
          rect(stateARR[i].stateCOX, stateARR[i].stateCOY, 90, 55);
          fill(0, 0, 153);
          rect(stateARR[oc].stateCOX, stateARR[oc].stateCOY, 90, 55);
          fill(255);
          textSize(15);
          text(stateARR[i].staTE, stateARR[i].stateCOX+10, stateARR[i].stateCOY+20);
          text(stateARR[oc].staTE, stateARR[oc].stateCOX+10, stateARR[oc].stateCOY+20);
          text("{"+stateARR[oc].enerGY+"}", stateARR[oc].stateCOX+45, stateARR[oc].stateCOY+20);
          text("P=["+RoundB(probTRANS[i][oc], 2)+"]", stateARR[oc].stateCOX+20, stateARR[oc].stateCOY+45);
          text("P=["+RoundB(probTRANS[i][i], 2)+"]", stateARR[i].stateCOX+20, stateARR[i].stateCOY+45);
          text("{"+stateARR[i].enerGY+"}", stateARR[i].stateCOX+45, stateARR[i].stateCOY+20);

          noStroke();
        }
      }
      break;
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function RoundB( Rval, Rpl) 
{
  let p = Math.pow(10, Rpl);
  Rval = Rval * p;
  let tmp = Math.round(Rval);
  return parseFloat(tmp/p) || 0;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// A ClASS FOR EVERY STATE AND THEIR ENERGY AS WELL AS RESPECTIVE POSITIONS IN ENERGY DIAGRAM
class staTES
{
  staTE;
  enerGY;
  orDER;
  stateCOX;
  stateCOY;
}
// SETS THE INTEGER ARRAY binArr WITH BINARY VALUES 
function setStates()
{

  for (let cc=0;cc<Math.pow(2,nUnits);cc++)
  {
    let s1 = dec2bin(cc);
    let s = new staTES();
    s.staTE = s1;
    binArr[cc] = s1;
    stateARR[cc] = s;
  }
}
// CALCULATES ENERGY FOR EACH STATE INDIVIDUALLY
function calculateENERGY(cA)
{
  let summ=0.0;
  let sumn=0.0;
  let enerGY;
  let temp = new createArray(3); 
  for (let ina=0;ina<cA.length;ina++) { 
    temp[ina]=(cA[ina].charCodeAt(0))-48;
  }
  for (let p=0;p<nUnits;p++)
  {
    for (let q=0;q<nUnits;q++)
    {
      summ = summ + weightA[p][q]*temp[p]*temp[q];
    }
    sumn = sumn+thresholdA[p]*temp[p];
  }
  enerGY = (-0.5*summ)+sumn;
  enerGY = Round(enerGY, 2);
  return(enerGY);
}
// FOR ROUNDING OFF ENERGY VALUES
function Round(Rval, Rpl) {
  let p = Math.pow(10, Rpl);
  Rval = Rval * p;
  let tmp = Math.round(Rval);
  return tmp/p;
}
//TAKES VALUES FROM binArr ONE BY ONE AND CALLS FOR ITS ENERGY
function callForEnergy()
{
// 2 ** nUnits
  for (let cc=0;cc<Math.pow(2,nUnits);cc++)
  {
    let cA= binArr[cc].split('');
    energyArr[cc] = calculateENERGY(cA);
    stateARR[cc].enerGY = energyArr[cc];
  }
}
//FINDING HAMMING DISTANCE BETWEEN TWO NODES, RETURN TRUE IF DIST IS ONE
function hamminDIST(outC, inC)
{
  let coun=0;
  let c1 = binArr[outC].split("");
  let c2 = binArr[inC].split("");
  for (let c=0;c<c1.length;c++)
  {
    if (c1[c]!=c2[c])
    {
      coun++;
    }
  }
  if (coun<2)
  {
    return true;
  }
  else
  {
    return false;
  }
}




//INITIALIZES THE WEIGHT MATRIX AND THRESHOLD VALUES
function initLZE()
{
  weightA = new createArray(3,3);
  thresholdA = new createArray(3);

  weightA[0][0] = 0.0;
  weightA[0][1] = -0.5;
  weightA[0][2] = 0.5;
  weightA[1][0] = -0.5;
  weightA[1][1] = 0.0;
  weightA[1][2] = 0.4;
  weightA[2][0] = 0.5;
  weightA[2][1] = 0.4;
  weightA[2][2] = 0.0;

  thresholdA[0] = -0.1;
  thresholdA[1] = -0.2;
  thresholdA[2] = 0.7;

  cenArr[0][0] = 50;
  cenArr[0][1] = 330;
  cenArr[1][0] = 250;
  cenArr[1][1] = 330;
  cenArr[2][0] = 150;
  cenArr[2][1] = 200;
}


function createBACK()
{
  fill(20, 20, 20);
  stroke(240, 160, 0);
  for (let h=0;h<nUnits;h++)
  {
    for (let l=0;l<nUnits;l++)
    {
      line(cenArr[h][0], cenArr[h][1]-10, cenArr[l][0], cenArr[l][1]-10);
    }
  }
  stroke(150, 120, 0);
  for (let h=0;h<nUnits;h++)
  {
    ellipse(cenArr[h][0], cenArr[h][1]-10, rad, rad);
  }
  noStroke();
  stroke(255);

  rect(20, 80, 300, 60);
  fill(240, 180, 30);
  rect(20, 80, 300, 25);
  line(120, 80, 120, 140);
  line(220, 80, 220, 140);


  textSize(15);
  fill(0);
  textSize(15);
  text("W12 = W21", 30, 100);
  text("W23 = W32", 130, 100);
  text("W31 = W13", 230, 100);
  fill(255); 
  text(""+weightA[0][1], 50, 130);
  text(""+weightA[0][2], 150, 130);
  text(""+weightA[2][1], 250, 130);
  textSize(15);
  fill(255);
  for (let l=0;l<nUnits;l++)
  {
    text(l+1, cenArr[l][0]-5, cenArr[l][1]-5);
  }
  //  fill(0);
  fill(252, 230, 0);
  text("Threshold="+thresholdA[0], 10, 355);
  //  text("Threshold="+thresholdA[0], 11, 365);
  text("Threshold="+thresholdA[1], 230, 355);
  //  text("Threshold="+thresholdA[1], 231, 365);
  text("Threshold="+thresholdA[2], 110, 165);
  //  text("Threshold="+thresholdA[2], 111, 175);
  fill(0);
  textSize(16);
  text("w13", 210, 255);
  //  text("w13", 211, 265); 
  text("=w31", 210, 275);
  //  text("=w31", 211, 285);
  text("w12", 55, 255);
  //  text("w12", 56, 265); 
  text("=w21", 50, 275);
  //  text("=w21", 51, 285);
  text("w23", 115, 310);
  //  text("w23", 116, 350); 
  text("=w32", 155, 310);
  //  text("=w32", 156, 350);
  fill(0);
  textSize(16);
  text("ADJUST TEMPERATURE", 30, 15);
  tempBAR(10, 20);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function tempBAR(x, y)
{
  stroke(155, 0, 0);
  fill(255);
  rect(x, y, 550, 50);
  noStroke();
  fill(230, 230, 0);
  rect(x+5, y+25, 540, 20);
  fill(0);
  stroke(0);
  textSize(15);
  for (let i=0;i<11;i=i+1)
  {
    line(x+17+50*i, y+22, x+17+50*i, y+42);
    if (i<10)
    {
      text("0.", x+5+50*i, y+18);
      text(i, x+20+50*i, y+18);
    }
  }
  text("1.0", x+510, y+18);
  noStroke();
}

function determineORDER(stateARRR,  energyArrR,  orderSTATEStemp)
{
  // TO SORT THE ENERGY ARRAY
  let mirrorArr = new createArray(Math.pow(2, nUnits));
  mirrorArr=energyArrR;
  sort(mirrorArr);
  for (let i=0;i< Math.pow(2, nUnits);i++)
  {
    let count = 0;
    for (let j=0;j<Math.pow(2, nUnits);j++)
    {
      if (stateARRR[j].enerGY==mirrorArr[i])
      {
        stateARRR[j].orDER = i;
        count++;
        if (count==2)
        {
          i++;
        }
      }
    }
  }
  for (let t=0;t<8;t++)
  {
    orderSTATEStemp[t] = stateARRR[t].orDER;
  }
}

function drawENERGYdiagram(stateARRR, orderSTATESS)
{
  //stateARR  orderSTATES
  let f = false;
  let count=1;
  for (let i=0;i<orderSTATESS.length;i++)
  {
    let drawStartXX = drawStartX;  
    let s = stateARRR[i].staTE;
    let ina = stateARRR[i].orDER; 
    for (let y=0;y<orderSTATESS.length;y++)
    {
      if (y!=i && ina == stateARRR[y].orDER)
      {
        count++;
        f = true;
      }
    }     
    if (i>=0 && f == true)
    {
      if (count>2) {
        count=1;
      }
      drawStartXX = drawStartXX + 150*(count-2);
      fill(50);
      rect(drawStartXX, drawStartY-(70*ina), 90, 55);
      fill(255);
      textSize(15);
      text(s, drawStartXX+10, (drawStartY-(70*ina))+20);
      text(s, drawStartXX+11, (drawStartY-(70*ina))+20);
      text("{"+stateARRR[i].enerGY+"}", drawStartXX+44, (drawStartY-(70*ina))+20);
      text("{"+stateARRR[i].enerGY+"}", drawStartXX+45, (drawStartY-(70*ina))+20);
      f= false;
      stateARRR[i].stateCOX = drawStartXX;
      stateARRR[i].stateCOY = drawStartY-(70*ina);
      drawStartXX = drawStartX;
    }
    else 
    {
      fill(50);
      rect(drawStartXX, drawStartY-(70*ina), 90, 55);
      fill(255);
      textSize(15);
      text(s, drawStartXX+10, (drawStartY-(70*ina))+20);
      text(s, drawStartXX+11, (drawStartY-(70*ina))+20);
      text("{"+stateARRR[i].enerGY+"}", drawStartXX+44, (drawStartY-(70*ina))+20);
      text("{"+stateARRR[i].enerGY+"}", drawStartXX+45, (drawStartY-(70*ina))+20);
      stateARRR[i].stateCOX = drawStartXX;
      stateARRR[i].stateCOY = drawStartY-(70*ina);
      f = false;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Draws Lines Betweeen Energy States Showing Possible Transitions
function drawCONNECIONS( probOFtrTEMPP,  TEMPstatesARR)
{
  for (let outC=0;outC<8;outC++)
  {
    for (let inC=0;inC<8;inC++)
    {
      if (probOFtrTEMPP[outC][inC]>0)
      {
        let f = 10*(energyArr[outC]+energyArr[inC]);
        f = f + abs(TEMPstatesARR[outC].stateCOX - TEMPstatesARR[inC].stateCOX)/5;
        stroke(0, 200, 0);
        line(TEMPstatesARR[outC].stateCOX, TEMPstatesARR[outC].stateCOY+30, TEMPstatesARR[inC].stateCOX-30-f, TEMPstatesARR[outC].stateCOY+30);
        line(TEMPstatesARR[inC].stateCOX-30-f, TEMPstatesARR[outC].stateCOY+30, TEMPstatesARR[inC].stateCOX-30-f, TEMPstatesARR[inC].stateCOY+15);
        line(TEMPstatesARR[inC].stateCOX-30-f, TEMPstatesARR[inC].stateCOY+15, TEMPstatesARR[inC].stateCOX, TEMPstatesARR[inC].stateCOY+15);
        fill(0);
        triangle(TEMPstatesARR[inC].stateCOX, TEMPstatesARR[inC].stateCOY+15, TEMPstatesARR[inC].stateCOX-10, TEMPstatesARR[inC].stateCOY, TEMPstatesARR[inC].stateCOX-10, TEMPstatesARR[inC].stateCOY+30);
        noFill();
        noStroke();
      }
    }
  }
}
// This part shows the temprature value when clicked .. 
function showTempInOne(clickVALX,  clickVALY)
{
  if (clickFLAG = true)
  {
   let p = clickVALX - 27.0;
    temprature = p/500;
    fill(0, 255);
    rect(330, 75, 150, 30);
    fill(240, 180, 20);
    textSize(18);
    text("TEMP := "+temprature, 340, 95);
    text("TEMP := "+temprature, 341, 95);
  }
}

function mouseClicked()
{
  for (let i=0;i<11;i++)
  {
    if (mouseX>10 && mouseX<529 && mouseY>20 && mouseY<70)
    {
      if (mouseButton==LEFT)
      {
        clickFLAG  = true; 
        clickVALX = parseFloat(mouseX) || 0;
        clickVALY = parseFloat(mouseY) || 0;
        clickX = mouseX;       
        markIT();
      }
      break;
    }
  }
  if (mouseX>45 && mouseX<290+45 && mouseY>565 && mouseY<585)
  {
    check = true;
    tStart = 1.0;
  }
  if (check == true)
  {
    if (mouseX>30 && mouseX<45 && mouseY>100 && mouseY<300)
    {
      let t1 = mouseY;
      t1 = t1 - 100.0;
      tTemp = Round(t1/200, 2);
      tTemp = 1-tTemp;
      makeClickedRect(mouseY);
      fmatCount+=1;
              tempCount+=1;
        if(tTemp<0.05)
        {
           tempVAL[tempCount] = 0.00;
        }
        else{
        tempVAL[tempCount] = Round(tTemp, 2);
        }
      if (tTemp>tStart)
      {
        negCount+=1;
      }
      else
      {
        if (negCount>0)
        {
          negCount-=1;
        }
      }
    }
    if (mouseX>70 && mouseX<170 && mouseY>380 && mouseY<410)
    { 
      tTemp=1.0;
      yCR=100;
      check = false;
      fmatCount=0;
      for (let i=0;i<20;i++)
      {
        for (let j=0;j<8;j++)
        {
          FMAT[i][j]=0.0;
        }
      }
      tempCount=0;
      for (let i=0;i<10;i+=1)
      {
        tempVAL[i]=0.0;
      }
    }
  }
}
function markIT()
{
  if (clickFLAG==true)
  {
    stroke(255, 0, 0);
    line(parseFloat(clickVALX), 45, parseFloat(clickVALX), 65);
    fill(255);
    ellipse(parseFloat(clickVALX), 55, 10, 10);
    noStroke();
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function printPROBmat()
{
  /// FOR PRINTING THE PROBABILITY MATRIX
  fill(0, 255);
  rect(10, 370, 385, 185); 
  fill(240, 180, 20);
  stroke(40, 20, 220);
  for (let i=0;i<8;i+=1)  
  {
    line(75+40*i, 375, 75+40*i, 553);
  }
  for (let i=0;i<9;i+=1)  
  {
    line(20, 390+20*i, 385, 390+20*i);
  }
  noStroke();
  fill(240, 180, 20);
  for (let i=0;i<8;i+=1)  
  {
    fill(250, 180, 180);
    textSize(14);
    text(binArr[i], 35, 405+20*i);

    for (let j=0;j<8;j+=1)  
    {
      fill(250, 180, 180);
      textSize(13);
      text(binArr[j], 85+40*j, 385);
      let d11 = RoundA(probTRANS[i][j], 2);

      text(""+d11, 80+40*j, 405+20*i);
    }
  }
  fill(0);
  rect(40, 560, 300, 30);
  stroke(255);
  rect(45, 565, 290, 20);
  noStroke();
  textSize(14);

  fill(160, 240, 0);
  text("Click Here To View The Annealing Schedule", 50, 580);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//This part deals with the window of annealing
function annealPART()
{
  for (let i=0;i<8;i+=1)
  {
    //    pMatrix[0][i] = 0.125;
    pMatrix[i] = 0.125;
  }  
  let tableVal;
  if (check)
  {
    let tempTableProb = new createArray(44,10);
    makeClickedRect(yCR);
    fill(120);
    rect(0, 0, 800, 600);
    let im1 = new Image;
    let im2 = new Image;
    //Now first settle about the equations display 
    im1 = loadImage('eqn1.jpg');
    im2 = loadImage('eqn2.jpg');
    image(im1, 10, 420, 340, 50);
    image(im2, 10, 480, 180, 45);    
    // load the probability matrix from the table in lets ..
    let s = loadStrings("./annealTAB.txt");
    let delim = "[ ]";
    for (let i=0;i<s.length-1;i+=1)
    {
      let tokens = s[i].split(delim);
      for (let ji=0;ji<tokens.length;ji+=1)
      {
        tempTableProb[i][ji] = float(tokens[ji]);
      }
    }
    tempVAL[0] = 1.0;  
    textSize(13);
    fill(0);
    text("Click on the temperatures to start annealing", 20, 40);
    text("Click on the temperatures to start annealing", 21, 40);
    fill(0);
    rect(70, 380, 100, 30);
    stroke(255);
    rect(75, 385, 90, 20);
    noStroke();
    textSize(16);
    fill(0);
    text("To Go Back To The Previous Screen", 35, 370);
    fill(255);
    text("CLICK", 100, 402);

    //    
    fill(0);
    // header and footer black rects
    rect(25, 91, 25, 10);
    rect(25, 300, 25, 10);   
    fill(230, 130, 0);
    stroke(0);
    //    rect for temp bar 
    rect(30, 100, 15, 200);  
    noStroke();
    fill(0);
    for (let i =0;i<20;i+=1)
    {  
      stroke(0);
      line(30, 100+10*i, 45, 100+10*i);
      noStroke();
    }
    if (tTemp<0.05)
    {
      tTemp = 0.0;
    }
    fill(0);
    text("Click on the bar to lower temperature", 20, 330);
    text("Click on the bar to lower temperature", 21, 330);    
    text("Temperature = "+Round(tTemp, 2), 70, 200);  
    textSize(14);
    text("Due to increased number of anealing steps,", 21, 60);  
    text("Due to increased number of anealing steps,", 20, 60);      
    text("Some steps have been skipped while display", 21, 75);  
    text("Some steps have been skipped while display", 20, 75);      
    if (tTemp<=tStart)
    {
      tStart = tTemp;
      annealNW(Round(tTemp, 3));
    }
    else
    {
      fill(200, 0, 0);
      let t21 = 200*(1-tStart);
      rect(20, t21+100, 40, 3);
      noFill();
      fill(0, 0, 0);
      textSize(15);
      text("Please enter a lower temprature than "+Round(tStart, 3), 60, 130);
      text("to anneal the network", 100, 140);
      noStroke();
    }
  }
}

function makeClickedRect(y)
{
  stroke(0);
  fill(0);
  yCR = y;
  rect(30, y-5, 15, 10);
  noStroke();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// this part will anneal and then display will be taken care of
function annealNW(temP)
{
  //********************************************


  //creating the display for annealing values of probability GUI
  //  countPM
  rect(375, 30, 410, 40);
  fill(240, 200, 0);
  rect(380, 35, 400, 30);
  for (let i=0;i<8;i+=1)
  {
    fill(0);
    stroke(0);
    line(380+50*(i+1), 35, 380+50*(i+1), 65);
    text(binArr[i], 390+50*i, 60);
    text(binArr[i], 391+50*i, 60);    
    noStroke();
  }
  //********************************************

  // creating matrix for displaying annealed values 
  let count = 0;
  let tt1 = new createArray(26,8);
  let diff = new createArray(8);

  //load the current row from State prob matrix in temp matrix
  for (let yi=0;yi<8;yi+=1) 
  {
    tt1[count][yi] = pMatrix[yi];
  }
  // created the probability matrix
  let tempPmat= new createArray(8,8);
  for (let y=0;y<8;y+=1) 
  {
    let s = binArr[y];
    let dTEMP = probFIRE(y, s, temP);
    for (let i=0;i<8;i+=1)
    {
      tempPmat[y][i] = RoundA(dTEMP[i], 3);
    }
  }
  // Taking transpose of the tempPmat
  let trPmat = new createArray(8,8);
  for (let g =0;g<8;g+=1)
  {
    for (let i=0;i<8;i+=1)
    {
      trPmat[i][g] = parseFloat(tempPmat[g][i]) || 0;
    }
  }
  //********************************************
  ///////////////////////////////////////////////
  do
  {  
    let ty = new createArray(8);
    for (let i=0;i<8;i+=1)
    {
      let sum = 0.0;
      for (let j=0;j<8;j+=1)
      {
        ty[j] = RoundA(trPmat[i][j], 3);
        let db = tt1[count][j]*ty[j];
        sum = sum+parseFloat(db) || 0;
      }

      pMatrix[i] = Round(sum, 3); 
      tt1[count+1][i] = Round(sum, 3);
    }
    count+=1;
    if (count==24)
    {
      for (let yy=0;yy<8;yy+=1)
      {
        pMatrix[yy] = tt1[count-1][yy];
      }
      break;
    }
    for (let u=0;u<8;u+=1)
    {
      diff[u] = Round(tt1[count][u] - tt1[count-1][u], 3);
    }
  }
  while (diff[0]>0.001 || diff[1]>0.001 || diff[2]>0.001 || diff[3]>0.001 || diff[4]>0.001 || diff[5]>0.001 || diff[6]>0.001 || diff[7]>0.001);
  //this is entering the value into prob matrix..
  for (let h =0;h<8;h+=1)
  {
    FMAT[fmatCount][h] = pMatrix[h];
  }
  console.log(FMAT);

  for (let i=0;i<8;i+=1)
  {
    pMatrix[i] = tt1[count][i];
  }
  // this is for the display of annealing probabilty schedule ...
  let x = 380;
  let y = 110;
  let y1 = y;
  for (let g=0;g<8;g+=1)
  {
    text("0.125", x+5+50*g, y-15);
    text("0.125", x+6+50*g, y-15);
  }
  for (let i=0;i<20;i+=1)
  {
    for (let j=0;j<8;j+=1)
    {
      if (FMAT[i][0]==0.0 && FMAT[i][1]==0.0 && FMAT[i][0]==0.0 && FMAT[i][2]==0.0 && FMAT[i][3]==0.0 && FMAT[i][4]==0.0 && FMAT[i][5]==0.0)
      {
        if (co>2)
        {
          break;
        }
        else
        {
          i+=1;
          co+=1;
        }
      }
      //This prints the probability values for previous temparature 
      text(FMAT[i][j], x+50*j, y1+3);  
      text(FMAT[i][j], x+50*j+1, y1+3);
    }
    
          //This prints the temprature values used in annealing
      textSize(15);
      text("TEMP", x-45, y-40);
      for(let j=0;j<20;j++)
      {
      if (tempVAL[j]!=0)
      {
        text(tempVAL[j], x-45, (y+3)+(20*j));
        stroke(200, 0, 200);
        //a line after every temp value of anneal
        line(x-45, (y+5)+(20*j), x, (y+5)+(20*j));
        noStroke();
      }
      }
    //putting a line after every row in prob matrix...
    y1=y1+20;
    stroke(0);
    line(380, y1-15, 780, y1-15);
    noStroke();
  }
  y = y+20*(fmatCount+1);

// now after printing temp, time to print previous prob
  for (let out=1;out<21-fmatCount;out+=1)
  {
    for (let ina=0;ina<8;ina+=1)
    {
      textSize(16);
      fill(0, 260, 155);
      if (tt1[out][0]==0.0 && tt1[out][1]==0.0 && tt1[out][0]==0.0 && tt1[out][2]==0.0 && tt1[out][3]==0.0 && tt1[out][4]==0.0 && tt1[out][5]==0.0)
      {
        break;
      }
      text(tt1[out][ina], x+50*ina, y);
    } 
    y = y+20;
    stroke(0);
    line(330+50*(out+1), 75, 330+50*(out+1), 520);
    line(331+50*(out+1), 75, 331+50*(out+1), 520);    
    line(380, 520, 780, 520);
    line(380, 521, 780, 521);    
    line(380, 100, 780, 100);
    line(380, 99, 780, 99);    
    line(380, 69, 380, 520);    
    line(381, 69, 381, 520);        
    noStroke();
  }
}

