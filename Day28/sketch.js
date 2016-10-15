var soundsample;
var analyzer;
var playbutton, stopbutton;


function preload() 
{
	soundsample = loadSound('sound/love-will-tear-us-apart.mp3');
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
  
  var vol = analyzer.getLevel();
  stroke(random(255),random(255),random(255));
  noFill();
  strokeWeight(.3);
  translate(width/2, height/2);
  rotate(map(vol, 0, 1, 0, height) / 25.0);
  scale(map(vol, 0, 1, 0, height) / 100.0);
  // triangle(0, -150, -10, 150, 10, 150);
  triangle(mouseX, -150, -mouseX*2, 150, mouseX*2, 150);

}

function pressButton(buttonName){
	if ('play'.indexOf(buttonName) != -1 ) {
		soundsample.play();
	}
	else if('stop'.indexOf(buttonName) != -1 ) {
		soundsample.pause();
	}
}
