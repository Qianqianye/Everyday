/* Poem Matrix
This project is my interpretation of the poem 'Far and Close' by Gu Cheng. Gu Cheng switched YOU, ME and CLOUD frequently in this poem to question the relationship of human-human-distance and human-nature-distance.
《远和近》
你，
一会儿看我，
一会儿看云。
我觉得，
你看我时很远，
你看云时很近。

-Reference: the Coding Train guest Video tutorial by Emily Xie [Guest Tutorial #4: Matrix Digital Rain in p5.js with Emily Xie](https://www.youtube.com/watch?v=S1TQCi9axzg)
*/ 

var streams = [];
var symbolSize = 60;


function setup() {
	createCanvas(windowWidth,windowHeight);
	background(255);
	var x = 0;
	for (var i = 0; i < width / symbolSize; i++) {
		stream = new Stream();
		stream.generateSymbols(x, random(-2000, 0));
		streams.push(stream);
		x += symbolSize
	}
	textSize(symbolSize);
	textFont('SimSun');
}

function draw() {
	background(255);
	streams.forEach(function(stream){
	stream.render();
	});
}

/* SYMBOL CLASS */
function Symbol (x, y, speed){
	this.x = x;
	this.y = y;
	this.value;
	this.speed = speed;
	this.switchInterval = round (random(50, 100));

	this.setToRandomSymbol = function() {
		if(frameCount % this.switchInterval == 0){
			var poem = [0x4F60, 0x770B, 0x6211, 0x4E91, 0x5F88, 0x8FD1, 0x8FDC, 0x4E00, 0x4F1A, 0x89C9, 0x5F97, 0x65F6, 0x3002, 0xFF0C] // Poem: 你 一会看我 一会看云 我觉得 你看我时很远 你看云时很近
			this.value = String.fromCharCode(
          	poem[floor(random(poem.length))]
        	);		
		}
	}

	this.rain = function (){
	 this.y = (this.y >= height) ? 0 : this.y += this.speed;
	}
}

/* STREAM CLASS */
function Stream(){
	this.symbols = [];
	this.totalSymbols = round(random (2, 6));
	this.speed = random (1, 5);

	this.generateSymbols = function (x, y){
		for (var i = 0; i <= this.totalSymbols; i++){
			symbol = new Symbol(x, y, this.speed);
			symbol.setToRandomSymbol();
			this.symbols.push(symbol);
			y -= symbolSize;
		}
	}

	 this.render = function(){
	 	this.symbols.forEach(function(symbol){
	 		fill(0, 0, 0);
			text(symbol.value, symbol.x, symbol.y);
			symbol.rain();
			symbol.setToRandomSymbol();
	 	});
	 }

}