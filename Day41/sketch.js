var t;
var ammt = 10;
var balls = [ammt];

function setup() {
	createCanvas(windowWidth,windowHeight);
	background(0);
  t = 0;
	for(var i = 0; i <= ammt; i++){
		balls[i] = new Fluid();
	}
}

function draw() {
  background(0,1);

	for(var i = 0; i <= ammt; i++){
		balls[i].display();
		balls[i].move();
}
}

function Fluid (){
	this.t = random(10);
	this.x = width * noise(this.t+5);
	this.y = height * noise(this.t+10);
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.diameter = random(50, 300);

	this.move = function() {
		this.x = width * noise(this.t+5);
		this.y = height * noise(this.t+10);
		this.t = this.t + 0.001;

		this.r = 255 * noise(this.t+10);
		this.g = 255 * noise(this.t+15);
		this.b = 255 * noise(this.t+20);
// console.log(this.x);
};

this.display = function() {
	noStroke();
	fill(this.r, this.g, this.b);
	ellipse(this.x, this.y, this.diameter, this.diameter);
}
}
