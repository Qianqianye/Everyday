// REFERENCE // http://p5js.sketchpad.cc/sp/pad/view/ro.CJRup0VuQnT98E/rev.1549 

var pendulums;
var count
var ballSize;
var mass = 1;
var time = 0.1;
var grav = 8.0;
var anchor;
 
function setup() {
  // info
  info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.top = '25px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.style.color = '#fff';
  info.style.fontWeight = 'bold';
  info.style.backgroundColor = 'transparent';
  info.style.zIndex = '1';
  info.style.fontFamily = 'Monospace';
  info.innerHTML = '/ Pendulums /</br>Created by <a href="http://qianqian-ye.com/" style="color: #b3ecec">Qianqian Ye</a>  Powered by <a href="http://p5js.sketchpad.cc/sp/pad/view/ro.CJRup0VuQnT98E/rev.1549 " style="color: #b3ecec">P5.js</a>';
  document.body.appendChild( info );

  createCanvas(windowWidth,windowHeight);
  pendulums = [];
  count = random(10,40);
  col = (255);
 
  var lng = random(50,80);
  var ang = random(0*PI/180,180*PI/180);
 
  ballSize = (height - lng)/count;
  anchor = createVector(width / 2, 15);
 
 
  for (var i=0; i<count;i++){
   pos = createVector(anchor.x+cos(ang)*lng, anchor.y+sin(ang)*lng);
    pendulums.push(new Ball(anchor.x, anchor.y, pos.x, pos.y, col+i*8));
    lng+=ballSize;
  }
}
 
function draw() {
  background(0);
  for (var i=pendulums.length-1;i>=0;i--){
  pendulums[i].update();
  pendulums[i].paint();
  }
}
 
function Ball(anchX, anchY, ballX, ballY, col) {
 
  this.col = col;
  this.anchorPos = createVector(anchX, anchY);
  this.ballPos = createVector(ballX, ballY);
  this.ball = p5.Vector.sub(this.ballPos, this.anchorPos);
  this.length = this.anchorPos.dist(this.ballPos);
  this.angle = atan2(this.ball.y, this.ball.x);
  this.angleVel = 0;
}
 
Ball.prototype.update = function() {
  this.ball = p5.Vector.sub(this.ballPos, this.anchorPos);
  this.angleAcc = -grav / this.length * sin(this.angle);
  this.angleVel += this.angleAcc * time;
  this.angle += this.angleVel;
  this.angle += HALF_PI; // set angle 0 to bottom
  this.ballPos.x = cos(this.angle) * this.length + this.anchorPos.x;
  this.ballPos.y = sin(this.angle) * this.length + this.anchorPos.y;
  this.angle -= HALF_PI; // restore
  this.ball = p5.Vector.sub(this.ballPos, this.anchorPos);
}
 
Ball.prototype.paint = function() {
  push();
  stroke(255);
  strokeWeight(2); 
  rect(this.anchorPos.x, this.anchorPos.y, 5, 5);
  fill(0);
  rect(this.ballPos.x, this.ballPos.y, ballSize, ballSize);
  pop();
}
 
function keyPressed(){
  setup();
    }