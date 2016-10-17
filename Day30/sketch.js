var t;

function setup() {
  createCanvas(windowWidth,windowHeight);
  background(0);
  stroke(255, 15);
  noFill();
  t = 0;
}

function draw() {  
  translate(width/2, height/2);
  
  for (var i=0; i < 30; i++) {
   
    rotate(i / 5.0);
 
    var x1 =  width * noise(t + 10);
  var x2 = width * noise(t + 20);
  var x3 = width * noise(t + 30);
  var x4 = width * noise(t + 40);
  var y1 = height * noise(t + 50);
  var y2 = height * noise(t + 60);
  var y3 = height * noise(t + 70);
  var y4 = height * noise(t + 80);

  quad(x1, y1, x2, y2, x3, y3, x4, y4);

  t += 1;

  if (frameCount % 600 == 0) {
  background(0);  
 
}
}
}