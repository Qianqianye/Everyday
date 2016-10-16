var t;

function setup() {
  createCanvas(windowWidth,windowHeight);
  background(0);
  stroke(255, 15);
  noFill();
  t = 0;
}

function draw() {
  var x1 =  mouseX;
  var x2 = width * noise(t + 20);
  var x3 = width * noise(t + 30);
  var x4 = width * noise(t + 40);
  var y1 = mouseY;
  var y2 = height * noise(t + 50);
  var y3 = height * noise(t + 60);
  var y4 = height * noise(t + 70);

  bezier(x1, y1, x2, y2, x3, y3, x4, y4);

  t += 0.005;

  if (frameCount % 1000 == 0) {
	background(0);
  }
}