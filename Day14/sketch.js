var balls = [];       
var gravity = 0.1;
var counter;
var button;
var slider;
var sliderVal;
var images = [];

function preload(){
images.push(loadImage("donuts/Donut-Vanilla-w-Rainbow-Sprinkles.png"));
images.push(loadImage("donuts/Blueberry_Donut.png"));
images.push(loadImage("donuts/chocolate-sprinkles.png"));
images.push(loadImage("donuts/glazed-donut.png"));
}

function setup() {
  createCanvas(windowWidth, windowHeight-150);
  counter = createP("");
  
  button = createButton("Click me to GET A NEW DONUT for Miko's Birthday!");
  button.mousePressed(newBallRand);
  button.position(20,20);

  slider = createSlider(100,400,200);
  sliderVal = createDiv("");

  // Initialize ball index 0
  balls.push(new Ball(150,0,150,0));

}

function draw() {
  // background(0);
  background(255,255,0);

  for (var i = 0; i < balls.length; i ++ ) { 
    balls[i].gravity();
    balls[i].move();
    balls[i].display();
  }

  sliderVal.html("Choose Your Own Donut Size: " + slider.value());
}

function newBall(inX,inY) {
  var type = int(random(images.length));
  var b = new Ball(inX,inY,slider.value(),type); 
  balls.push(b);
}

function newBallRand() {
  var type = int(random(images.length));
  var b = new Ball(random(width),random(height),slider.value(),type); 
  balls.push(b);
}

function Ball(tempX, tempY, tempW, tempType) {
  this.x = tempX;
  this.y = tempY;
  this.w = tempW;
  this.speed = 0;
  this.type = tempType;

  this.gravity = function() {
    this.speed = this.speed + gravity;    
  }

  this.move = function() {
    this.y = this.y + this.speed;
    if (this.y > height) {
      this.speed = this.speed * -0.95;
      this.y = height;
    }    
  }

  this.display = function() {
    image(images[this.type],this.x,this.y,this.w,this.w); 
  }
}
