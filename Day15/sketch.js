
var playMode = 'sustain';
var samples = [];

function preload(){
	samples.push(loadSound("sound/Qianqian.mp3"));
	samples.push(loadSound("sound/Ye.mp3"))
}

function pressButton(buttonName){

	if ('Qianqian'.indexOf(buttonName) != -1 ) {
		samples[0].play();   
	}
	else if('Ye'.indexOf(buttonName) != -1 ) {
		samples[1].play();  
	}
	else{
		console.log('that button is not programmed yet');
	}
}

function setup() {
	createCanvas(710,50);
	soundFormats('mp3', 'ogg');
}

function keyPressed(k) {
	togglePlayMode();
}

