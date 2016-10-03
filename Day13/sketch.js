var flies = [];
var lifespan = 80;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
  background(0);
  for (var i = flies.length-1; i >= 0; i--) {
    var fly = flies[i];
    fly.update();
    fly.display();
    if (fly.isDead()) {
      flies.splice(i, 2);
    }
  }  
}

function mouseMoved(mouse) {
  flies.push(new Form(mouse.clientX, mouse.clientY));
}

function Form(x,y) {
  this.pos = createVector(x,y);
  this.vel = createVector(0, 0);
  this.lifespan = lifespan;
  this.size = random(5,30);
  this.weight = random(0.2,2);
  // this.color = random(100,255);
  
  this.update = function(){
    this.acc = p5.Vector.fromAngle(random(TWO_PI), random(TWO_PI));
    this.acc.setMag(0.2);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
  
  this.display = function(){
    fill(0);
    stroke(255);
  	strokeWeight(this.weight);
    var n = random();
    rect(this.pos.x, this.pos.y, this.pos.x - this.size, this.pos.y - this.size);
  }
}

	Form.prototype.isDead = function(){
  	if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};
