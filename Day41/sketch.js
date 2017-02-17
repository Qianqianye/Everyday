var t;
var ammt = 30;
var balls = [ammt];
var bg = false;

function setup() {
	createCanvas(windowWidth,windowHeight);
	background(255);
  t = 0;
	for(var i = 0; i <= ammt; i++){
		balls[i] = new Fluid();
	}
}

function draw() {
   if(bg){
    background(255);
  }
  else{
    background(255, 5);
  }

	for(var i = 0; i <= ammt; i++){
		balls[i].display();
		balls[i].move();
}
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed(){
  switch (key) {
    case ' ':
      bg = !bg;
      break;
  }
}

function Fluid (){
	this.t = random(10);
	this.x = width * noise(this.t+5);
	this.y = height * noise(this.t+10);
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.diameter = random(10, 150);

	this.move = function() {
		this.x = width * noise(this.t+5);
		this.y = height * noise(this.t+10);
		this.t = this.t + 0.001;

		this.r = 255 * noise(this.t+20);
		this.g = 255 * noise(this.t+30);
		this.b = 255 * noise(this.t+40);
// console.log(this.x);
};

this.display = function() {
	noStroke();
	fill(this.r, this.g, this.b);
	// fill('rgba(this.r,this.g,this.b, 0.9)');
	ellipse(this.x, this.y, this.diameter, this.diameter);
}
}
