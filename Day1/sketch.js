///  https://p5js.org/reference/


function setup() {
	createCanvas(windowWidth,windowHeight);
	background(255);
	noStroke();
}

function draw() {
	fill(random(200),random(200),random(200));
	ellipse(mouseX,mouseY,50,50);
}