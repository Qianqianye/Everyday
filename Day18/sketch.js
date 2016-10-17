var xpositions = [];
var ypositions = [];

function setup() {
  createCanvas(windowWidth,windowHeight);

  for (var i = 0; i < 100; i++){
    xpositions[i] = random(width);
    ypositions[i] = random(height);
  }
}

function draw() {
  background(0);
  noFill();
  for (var i = 0; i < 100; i++){ 
    stroke(random(255),random(255),random(255));
    knife(xpositions[i],ypositions[i],10,atan2(mouseY-ypositions[i], mouseX-xpositions[i]));
  }
}

function knife(xposition, yposition, size, angle){
  push();
  translate(xposition,yposition);
  rotate(angle);
  translate(-xposition,-yposition);
  triangle( xposition+20, yposition+10, xposition+60, yposition-60,xposition, yposition);
  pop();
}