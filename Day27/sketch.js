var soundsample;
var analyzer;
var playbutton, stopbutton;

function preload() 
{
	soundsample = loadSound('sound/rain.mp3');
}

function setup() 
{
	createCanvas(windowWidth,windowHeight);
	background(0);
	soundsample.loop(); 
	soundsample.stop();

  // music visualizer
  analyzer = new p5.Amplitude();
  analyzer.setInput(soundsample);
}

function draw()
{
  // background(0); // use this if only wanna show one circle
  
  var vol = analyzer.getLevel();
  stroke(255);
  noFill();
  strokeWeight(.3);
  ellipse(width/2, height/2, map(vol, 0, 1, 0, height)*15, map(vol, 0, 1, 0, height)*15); // draw an ellipse based on current volume level
}

function pressButton(buttonName){
	if ('play'.indexOf(buttonName) != -1 ) {
		soundsample.play();
	}
	else if('stop'.indexOf(buttonName) != -1 ) {
		soundsample.pause();
	}
}

