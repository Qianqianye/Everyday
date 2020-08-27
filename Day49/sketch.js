// P5 STUFF
// making sound out of nothing = SYNTHESIS
var alpha, beta, gamma;
var xmotion, ymotion, zmotion;
var wave;
var bgColor;
var r, g, b;
var theAmp, theFreq; // will use alpha beta gamma for this. 

function setup() {
	var canvas = createCanvas(windowWidth, windowHeight);

	// NEW OSCILLATOR OBJECT
	wave = new p5.Oscillator();
	// set properties to our new wave
	wave.setType('sine');
	// need to pass in a string for what kind of wave we want
	wave.start();
	wave.freq(440); //440Hz is the note A
	wave.amp(0.5); //number between 0 and 1

}

function draw() {
	background('darkcyan');
	var bg = map(alpha, 0, 360, 0, 255);
	background(bg);
	// ellipse(windowWidth/2, windowHeight/2, alpha, beta);
  	console.log('draw');
	theAmp = map(alpha, 0, height, 0, 1);
	theFreq = Math.floor(map(beta, 0, width, 100, 1200));

	wave.freq(theFreq);
	wave.amp(theAmp);
	console.log(theFreq);

}

// OTHER JAVASCRIPT DOWN HERE
// run this AFTER the page has loaded 
// EVERYTHING THAT IS NOT A P5 
function init(){
	////// ORIENTATION
	// create 3 variables: alpha, beta, gamma; 
	
	// function for orientation 
	function handleOrientation(){
		alpha = Math.floor(event.alpha);
		beta = Math.floor(event.beta);
		gamma = Math.floor(event.gamma);

		// send values
		document.getElementById('alpha').innerHTML = alpha;
		document.getElementById('beta').innerHTML = beta;
		document.getElementById('gamma').innerHTML = gamma;

	}

	// event listener for orientation - built in to JS
	window.addEventListener('deviceorientation', handleOrientation, true);
}

window.addEventListener('load', init);


