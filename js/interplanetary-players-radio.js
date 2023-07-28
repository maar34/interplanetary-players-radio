


let sw, sh; // window size
let padX; // gui separation
var btW, btH, sliderW, sliderH, initSpeed;
let trackI, filterI; // track 1 -  
let font1; // font variable
let playStateI;
let params; // url parameters
let levelI, worldI_dist, radioColor;
let tempID, xDifference, yDifference;
let loadingBar, loadP;
let xSlider, ySlider, zSlider;
let xData, yData, zData, xDataNorm, yDataNorm, zDataNorm;
let easyX, easyY;
let bcol, col;
let freq, back;
let t1, t2, t3, t4, t5, t6, t7, t8, t11;
var game, deck, suit, loadDeck;
let cam1;
let portrait;
let notDOM;
//let device;
let inputX, inputY, inputZ;
let wMinD = 333;
let wMaxD = 1544;
let userInteracted = false;


let radioElement; // Declare a variable to store the audio element
let radioStreamURL; // Replace this with the URL of your radio stream


let worldI_speed = 1.0;

const numSamples = 1024;
// Array of amplitude values (-1 to +1) over time.
let samples = [];

var radio = {
  id: "",
  wavfile: "",
  mp3file: "",
  radioURL: "",
  initTime: "",
  endTime: "",
  speed: "",
  minSpeed: "",
  maxSpeed: "",
  col1: "",
  col2: "",
  engine: "",
  xTag: "",
  yTag: "",
  zTag: ""
}
document.oncontextmenu = () => false; // no right click

var easycam,
  state = {
    distance: 388, //final distance
    center: [0, 0, 0],
    rotation: [1., 0., 0., 0.],
  },
  panelX = 30, panelY = 45;


function preload() {

  params = getURLParams();

  game = loadJSON("data/1.json");

  font1 = loadFont('fonts/Orbitron-VariableFont_wght.ttf');

}

document.body.onclick = () => {
  if (!userInteracted) {
    //playButton.click();
    handleFirstInteraction();
  }else{

    context.resume();

  }
  
}
// prevent screen movement on touchstart event
document.body.addEventListener('touchstart', function (e) {
  if (e.target == document.body) {
    e.preventDefault();
  }
}, { passive: false });

function setup() {


  initVariables();
  xData = 1;
  yData = 0;
  xDataNorm = 1;
  yDataNorm = 0;


  playStateI = 0;
  worldI_dist = 940;

  bcol = color(0, 0, 0, 10);
  col = color(255, 0, 0);

  // Check if params.r is available in the URL, otherwise use 0
  const radioNumber = params.r ? params.r : 0;

  // Use the radioNumber to access the corresponding element in game.A array
  radio = game.A[radioNumber];

  worldI_speed = radio.speed;

  //print (radio.engine); 
  xDifference = (radio.xTag[2] - radio.xTag[1]) > 10;
  yDifference = (radio.yTag[2] - radio.yTag[1]) > 10;


  createDom();

  // Create Canvas - Always the landscape.  
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  setAttributes('antialias', true);

  easycam = createEasyCam();
  easycam.setState(state, 3000); // animate to state in 3 second
  easycam.setDistanceMin(wMinD);
  easycam.setDistanceMax(wMaxD);
  easycam.state_reset = state;
  easycam.setPanScale(0.0);
  easycam.setPanScale(.02);

  //easycam.removeMouseListeners();


  radioColor = color(radio.col1);

  // Use the selected Font 

  textFont(font1);
  textSize(27);

  loaded();


  //    loadingAudio(0);
}

function draw() {



  
  if (playStateI == 1) background(0, 0, 0);
  noStroke();
  lights();
  const wsize = 1.2


  if (loadP) loadGUI();



  //Planet and Background color (back from Sliders)
  push();
  // translate (0., 0., -666.);

  normalMaterial();

  
  easycam.rotateY(playStateI * easyY);
  easycam.rotateX(playStateI * easyX);

  sphere(80, 6, 6);
  rotateX(PI * .4);
  torus(120 * wsize, 7 * wsize, 6, 7);

  translate(- 260, 0., 0.);
  sphere(15, 6, 6);

  translate(520, 0., 0.);
  sphere(15, 6, 6);

  translate(- 260, - 260., 0.);
  sphere(15, 6, 6);

  translate(- 0, 520., 0.);
  sphere(15, 6, 6);
  //translate (0., 0., 666.);

  pop();

  noFill();
  stroke(radioColor);

  easycam.beginHUD();

  if (playStateI == 0) fill(0, 0, 0, .8);

  const margin = 3.3;
  strokeWeight(3.);
  beginShape();
  vertex(margin + 0, margin + 0);
  vertex(sw * .86, margin + 0);
  vertex(sw - margin, sh * .14);
  vertex(sw - margin, sh - margin);
  vertex(sw * .14, sh - margin);
  vertex(margin + 0,  sh - margin );
  vertex(margin + 0, margin + 0);
  endShape();


  easycam.endHUD();

}


function playPause() {
  

  notDOM = false;

  let messageEvent;


  if (playStateI == 0) {

    playButton.html('II');
    context.resume();
 //   messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "play", [1]);
 
    radioElement.play();

   // device.scheduleEvent(messageEvent2);
    // device.scheduleEvent(messageEvent3);
    playStateI = 1;

  } else {

    messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "play", [0]);

    playButton.style('transform', 'rotate(0deg)');
    playButton.html('&#9655');
    playStateI = 0;
    radioElement.pause();


  }
//  device.scheduleEvent(messageEvent);

//  xSlider.value(xSlider.value());
//  xInput();

}

function xB() {
  notDOM = false;
  xSlider.value(128.);
  xInput();

}

function yB() {
  notDOM = false;
  ySlider.value(128.);  
  yInput();
}

function zB() {
  notDOM = false;
  zSlider.value(128.);
  zInput();
}

function loaded() {

  loadP = false;


  xSlider.show();
  ySlider.show();
  zSlider.show();
  xButton.show();
  yButton.show();
  zButton.show();
  playButton.show();

  guiData();

  //trackI.disconnect();
  //trackI.connect(filterI);

}

function errorLoadingAudio(_error) {

  let p = createP(_error);
  p.style('font-size', '16px');
  p.position(10, 0);

}

function loadingAudio(_loadingN) {

  loadingBar = _loadingN;
  loadP = true;

}


function createDom() {

  let domColor = color (radio.col1);
  let domAlpha = color (radio.col1); 
  domAlpha.setAlpha(190);



  xButton = createButton('&#11042');

  xButton.style('width', btW + 'px');
  xButton.style('height', btH + 'px');
  xButton.style('background-color', domColor);
  xButton.style('color', domAlpha);
  xButton.style('font-size', '3rem');
  xButton.style('border', 'none');
  xButton.style('background', 'none');
  xButton.mousePressed(xB);
  xButton.touchStarted(xB);
  xButton.mouseReleased(releaseDOM);
  xButton.touchEnded(releaseDOM);
  //xButton.addClass("crosshair");

  yButton = createButton('&#11042');
  yButton.style('width', btW + 'px');
  yButton.style('height', btH + 'px');
  yButton.style('background-color', domColor);
  yButton.style('color', domAlpha);
  yButton.style('font-size', '3rem');
  yButton.style('border', 'none');
  yButton.style('background', 'none');
  yButton.mousePressed(yB);
  yButton.touchStarted(yB);
  yButton.mouseReleased(releaseDOM);
  yButton.touchEnded(releaseDOM);
  //yButton.addClass("crosshair");

  zButton = createButton('&#11042');
  zButton.style('width', btW + 'px');
  zButton.style('height', btH + 'px');
  zButton.style('background-color', domColor);
  zButton.style('color', domAlpha);
  zButton.style('font-size', '3rem');
  zButton.style('border', 'none');
  zButton.style('background', 'none');
  zButton.mousePressed(zB);
  zButton.touchStarted(zB);
  zButton.mouseReleased(releaseDOM);
  zButton.touchEnded(releaseDOM);
  //zButton.addClass("crosshair");

  xButton.position(innerWidth * .5 - (btW * .5), innerHeight * .8);
  yButton.position(-11., innerHeight * .37);
  zButton.position(innerWidth * .7, innerHeight * .37);


    // create buttons and sliderss
    playButton = createButton('&#9655');
    playButton.position( -11 , innerHeight * .88);

    playButton.style('width',  btW+ 'px');
    playButton.style('height',  btH + 'px' );
    playButton.style('background-color', domColor);
    playButton.style('color', domAlpha);
    playButton.style('font-size', '2rem');
    playButton.style('border', 'none');
    playButton.style('background', 'none');
    playButton.mousePressed(handleFirstInteraction);
    playButton.mouseReleased(releaseDOM);
    playButton.touchEnded(releaseDOM);



  // create sliders

  initSpeed = map(float((radio.speed)), float(radio.minSpeed), float(radio.maxSpeed), 0., 255.);
  xSlider = createSlider(0., 255, 128);
  xSlider.style('width', sliderW + 'px');
  xSlider.addClass("slider");
  // xSlider.style('height', sliderH+'px');
  xSlider.input(xInput);
  xSlider.mousePressed(pressDOM);
  xSlider.touchStarted(pressDOM);
  xSlider.mouseReleased(releaseDOM);
  xSlider.touchEnded(releaseDOM);

  //   myElement.style('background', domColor); // this change only the line color*/
  // xSlider.style('::-webkit-slider-thumb:background', 'red');
  // xSlider.style('background', 'rgba(0, 0, 0, 0)');
  // myClass.style(`::-webkit-slider-thumb { background: ${domColor}; }`);


  ySlider = createSlider(0, 255, 128);
  ySlider.style('width', sliderW + 'px');
  ySlider.style('transform', 'rotate(-90deg)');
  ySlider.addClass("slider");
  ySlider.style('height', sliderH+'px');
  ySlider.input(yInput);
  ySlider.mousePressed(pressDOM);
  ySlider.touchStarted(pressDOM);
  ySlider.mouseReleased(releaseDOM);
  ySlider.touchEnded(releaseDOM);


  zSlider = createSlider(0, 255, 128);
  zSlider.style('width', sliderW + 'px');
  zSlider.style('height', sliderH+'px');
  zSlider.style('transform', 'rotate(-90deg)');
  zSlider.addClass("slider");
  zSlider.input(zInput);
  zSlider.mousePressed(pressDOM);
  zSlider.touchStarted(pressDOM);
  zSlider.mouseReleased(releaseDOM);
  zSlider.touchEnded(releaseDOM);

  xSlider.hide();
  ySlider.hide();
  zSlider.hide();
  playButton.hide();
  xButton.hide();
  yButton.hide();
  zButton.hide();

  xSlider.position(innerWidth * .5 - (sliderW * .5), innerHeight * .8);
  ySlider.position(0, innerHeight * .4);
  zSlider.position(innerWidth * 0.7- (sliderW * .5), innerHeight * .4);

}

function updateDom() {

  sw = window.innerWidth;
  sh = window.innerHeight;

  sliderW = sw * .6;
  sliderH = sliderW * .11;

  // move buttons
  playButton.position( -11 , innerHeight * .88);
  xButton.position(innerWidth * .5 - (btW * .5), innerHeight * .8);
  yButton.position(-11., innerHeight * .34);
  zButton.position(innerWidth * .7, innerHeight * .34);

  // move sliders
  xSlider.position(innerWidth * .5 - (sliderW * .5), innerHeight * .8);
  ySlider.position(0, innerHeight * .4);
  zSlider.position(innerWidth * 0.7- (sliderW * .5), innerHeight * .4);

}

function pressDOM() {
  notDOM = false;
}
function releaseDOM() {
  notDOM = true;

}


function xInput() {

  inputX.value = xSlider.value();
  xData = map(xSlider.value(), 0., 255., float(radio.xTag[1]), float(radio.xTag[2]));
  // if (radio.xTag[0] == "Speed") worldI_speed = xData; 
  t6.html(nfs(xData, 1, 2));
  xDataNorm = map(xData, float(radio.xTag[1]), float(radio.xTag[2]), -1., 1.);

  if (xDifference) {
    yDataNorm = map(yData, float(radio.yTag[1]), float(radio.yTag[2]), -1., 1.);
    easyY = xDataNorm * -0.077;
  } else {
    easyY = xData * -0.077;
  }

}

function yInput() {

  inputY.value = ySlider.value();
  yData = map(ySlider.value(), 0., 255., float(radio.yTag[1]), float(radio.yTag[2]));
  t7.html(nfs(yData, 1, 2));

  // if the range in x axe is greter than 10 (xDifference) then animate planet with normalized value, else use the normal value - this exception works nice with speed and non simetrical parameters
  if (yDifference) {
    yDataNorm = map(yData, float(radio.yTag[1]), float(radio.yTag[2]), -1., 1.);
    easyX = yDataNorm * -0.077;
  } else {
    easyX = yData * -0.077;
  }


}

function zInput() {

  if (zSlider.value() <= 127.) {
    worldI_dist = map(zSlider.value(), 0., 127., wMaxD, wMinD);
  } else {
    worldI_dist = map(zSlider.value(), 127., 255., wMinD, wMaxD);
  }
  easycam.setDistance(worldI_dist, 1.);

  inputZ.value = zSlider.value();

  t5.html(nfs(worldI_dist, 1, 2));

  zData = map(zSlider.value(), 0., 255., float(radio.zTag[1]), float(radio.zTag[2]));
  t8.html(nfs(zData, 1, 2));


}



function xOutput() {
  if (!loadP) {
    var startX = easycam.mouse.curr[0];
    var deltaX = map(startX, 0., sw, 0., 255.);
    inputX.value = deltaX;

    xSlider.value(deltaX);
    xData = map(xSlider.value(), 0., 255., float(radio.xTag[1]), float(radio.xTag[2]));
    // if the range in x axe is greter than 10 (xDifference) then animate planet with normalized value, else use the normal value - this exception works nice with speed and non simetrical parameters
    if (xDifference) {
      yDataNorm = map(yData, float(radio.yTag[1]), float(radio.yTag[2]), -1., 1.);
      easyX = yDataNorm * -0.077;
    } else {
      easyX = yData * -0.077;
    }



    //  if (radio.xTag[0] == "Speed") worldI_speed = xData; 
    t6.html(nfs(xData, 1, 2));



  }
}

function yOutput() {
  if (!loadP) {

    var startY = easycam.mouse.curr[1];
    var deltaY = map(startY, 0., sh, 255., 0.);
    ySlider.value(deltaY);
    inputY.value = ySlider.value();
    yData = map(ySlider.value(), 0., 255., float(radio.yTag[1]), float(radio.yTag[2]));
    yDataNorm = map(yData, float(radio.yTag[1]), float(radio.yTag[2]), -1., 1.);

    t7.html(nfs(yData, 1, 2));

  }
}

function zOutput(delta) {
  if (!loadP) {

    var zDelta = zSlider.value() + delta;
    inputZ.value = zDelta;
    zSlider.value(zDelta);

    if (zSlider.value() <= 127.) {
      worldI_dist = map(zSlider.value(), 0., 127., wMaxD, wMinD);
    } else {
      worldI_dist = map(zSlider.value(), 127., 255., wMinD, wMaxD);
    }
    t5.html(nfs(worldI_dist, 1, 2));
    easycam.setDistance(worldI_dist, 1.);

    var zData = map(zSlider.value(), 0., 255., float(radio.zTag[1]), float(radio.zTag[2]));
    t8.html(nfs(zData, 1, 2));



  }
}


function guiData() {

  let offset = 3.;
  let textColor = radio.col1;

  // Render the labels

  t1 = createP('Distance:');
  t1.position(padX * offset, padY * offset);
  t1.style('color', textColor);

  t2 = createP(radio.xTag[0] + ":");
  t2.position(padX * offset, padY * offset + 20);
  t2.style('color', textColor);

  t3 = createP(radio.yTag[0] + ":");
  t3.position(padX * offset, padY * offset + 40);
  t3.style('color', textColor);

  t4 = createP(radio.zTag[0] + ":");
  t4.position(padX * offset, padY * offset + 60);
  t4.style('color', textColor);

  t5 = createP();
  t5.html(worldI_dist);
  t5.position(padX * offset + 90, padY * offset);
  t5.style('color', textColor);

  t6 = createP();
  t6.html(nfs("0", 1, 2));
  t6.position(padX * offset + 130, padY * offset + 20);
  t6.style('color', textColor);

  t7 = createP("0");
  t7.position(padX * offset + 130, padY * offset + 40);
  t7.style('color', textColor);

  t8 = createP("0");
  t8.position(padX * offset + 130, padY * offset + 60);
  t8.style('color', textColor);

    // Render Metadata

    t11 = createP('Astronauts:');
    t11.position(padX * offset, padY * offset + 100 );
    t11.style('color', radio.col2);
  
    t12 = createP("Streamer" + ":");
    t12.position(padX * offset, padY * offset + 120);
    t12.style('color', radio.col2);
  
    t13 = createP("Data" + ":");
    t13.position(padX * offset, padY * offset + 140);
    t13.style('color', radio.col2);
  
    t14 = createP("Artist" + ":");
    t14.position(padX * offset, padY * offset + 160);
    t14.style('color', radio.col2);
  
    t15 = createP();
    t15.html(worldI_dist);
    t15.position(padX * offset + 130, padY * offset + 100);
    t15.style('color', radio.col2);
  
    t16 = createP();
    t16.position(padX * offset + 130, padY * offset + 120);
    t16.style('color', radio.col2);
  
    t17 = createP("0");
    t17.position(padX * offset + 130, padY * offset + 140);
    t17.style('color', radio.col2);
  
    t18 = createP("0");
    t18.position(padX * offset + 130, padY * offset + 160);
    t18.style('color', radio.col2);

}

function loadGUI() {
  ///// LOADING TEXTS 
  textAlign(CENTER);
  let tempF = frameRate() % 30.;
  if (tempF > 15.) {
    fill(0, 0, 255);
  } else {
    fill(255, 0, 0);
  }
  if (loadingBar == 1) {
    translate(0., 0., -666.);

    text("Receiving Sound Waves", 0, -sh * .34 - padY * 4);
    text("please wait, unmute device...", 0, -sh * .34 - padY * 1);
    translate(0., 0., 666.);

  } else {
    text("", 0, -padY * 13);
  }
}

function windowResized() {

  initVariables();
  resizeCanvas(sw, sh);
  updateDom();
  easycam.setViewport([0, 0, sw, sh]);

}

function touchStarted() {

}
function touchMoved() {
  if (notDOM) {
    xOutput();
    yOutput();
  }

  //print(notDOM); 

}



function mousePressed() {

}

function mouseWheel(event) {

  zOutput(-event.delta * .1);

}

function doubleClicked() {
  xB();
  yB();
  zB();
}

function initVariables() {

  sw = window.innerWidth;
  sh = window.innerHeight;
  padX = sw / 77.;
  padY = sh / 100.;
  btW = sw * .15;
  btH = sw * .15;
  sliderW = sw * .6;
  sliderH = sliderW * .11;
  startX = 0;
  startY = 0;
  notDOM = true;

}


async function createRNBO() {
  try {

    const patchExportURL = "export/" + radio.engine;
    let WAContext = window.AudioContext || window.webkitAudioContext;
    context = new WAContext();

    radioStreamURL = radio.radioURL;


    // Fetch the exported RNBO patch

    let rawPatcher = await fetch(patchExportURL);
    let patcher = await rawPatcher.json();
    
     // Create Radio Stream Player   

    radioElement = new Audio();
    radioElement.src = radioStreamURL;
    radioElement.crossOrigin = 'anonymous';

    // Get Metadata from the radio. 

    getNowPlaying();
    setInterval(getNowPlaying, 5000); // 5000 milliseconds = 5 seconds
    
    // Create the devices

    const sourceNode = context.createMediaElementSource(radioElement);
    const  device = await RNBO.createDevice({ context, patcher });    
    
    // Connect the devices in series

    sourceNode.connect(device.node);
    device.node.connect(context.destination);

    inputX = device.parametersById.get("inputX");
    inputY = device.parametersById.get("inputY");
    inputZ = device.parametersById.get("inputZ");


  } catch (error) {
    console.log(error);
    errorLoadingAudio(error);
  }
}


function getNowPlaying() {
  const endpointUrl = 'https://s1.ssl-stream.com/api/nowplaying/maar_world_radio';

  fetch(endpointUrl, {
      headers: {
          'accept': 'application/json'
      }
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          displayNowPlaying(data);
          

      })
      .catch(error => {
          console.error('Error fetching now playing data:', error);
      });
}

function displayNowPlaying(nowPlayingData) {
  //console.log('Now Playing:', nowPlayingData);
  t15.html(nowPlayingData.listeners.current);
  t16.html(nowPlayingData.live.streamer_name);
  t17.html(nowPlayingData.now_playing.song.title);
  t18.html(nowPlayingData.now_playing.song.artist);
}


function handleFirstInteraction() {
  if (!userInteracted) {
    userInteracted = true;
    createRNBO();
    setTimeout( playPause, 300);
  }else{

    playPause();

  }
 

}