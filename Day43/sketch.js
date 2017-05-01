var women;

function setup(){
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	women = new Array ();
	for (var w = 0; w < 16; w++) {
		var xLoc = map(w, 0 , 16, 100, width);
	
		var yLoc = int(w%4)*height/4.5 +120;

		womenN = new SuperWoman(createVector(xLoc,yLoc) );
		womenN.superwomanStart();
		append(women, womenN);
	}
}

function draw(){
	background(255);
	for (var i = 0; i < women.length; i++) {
	women[i].superwomanDraw();
	}
}

function SuperWoman(startPos){
	this.pos = startPos;
	this.posWait = startPos;
	this.posFlyto;
	this.transform;
	this.upDown;
	this.state;
	this.flyTime;
	this.a;

	this.superwomanStart = function(){
		this.pos = createVector(this.posWait.x,	this.posWait.y);
		this.transform = 0;
		this.flyTime = 0;
		this.upDown = false;
		this.state = 0;
		this.posFlyto = new Array(this.posWait);
		var upV = createVector(this.posWait.x, this.posWait.y-100);
		append (this.posFlyto, upV);
		for (var i = 0; i < 3; i++) {
			var randomPosition = createVector(3*random(0, width), 3*random (0, this.posWait.y-300)); //FLY PATH
			append (this.posFlyto, randomPosition);
		}
	}

	this.superwomanDraw = function(){
		this.stateMachine();
		noStroke();
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.a);
	
		capeColor = color(237,34,93);
		bodyColor = color (0);
		currentColor = lerpColor(bodyColor, capeColor, this.transform/100);
		fill(currentColor);
		quad(-20,0-50,   20,0-50,   50,0+50,   -50,0+50); //CAPE
	
		fill(0);
		rect(0, 0, 50,100); //BODY
		ellipse(0,-90, 50,50); //HEAD
		triangle(0,-10,-50,0+50, 50,50); //SKIRT

		strokeWeight(15);
		strokeCap(ROUND);
		stroke(0);
		strokeJoin(ROUND);
		noFill()
		line(0-15,0+120,0-15,0); //LEFT LEG
		line(0+15,0+120,0+15,0); //RIGHT LEG
		
		var armHeight = map (this.transform,0,100, 10, -110);
		var armHover = map (this.transform,0,100,PI, 0);
		var armAddition = sin(armHover)*40;
		beginShape();   //ARMS
		vertex(0-50,0+10);
		vertex(0-30,0-50);
		vertex(0+30,0-50);
		vertex(0+50+armAddition,0+armHeight);
		endShape();
		pop();
	}

	this.stateMachine = function(){
			if (this.state == 0) {   //waiting state
		var mouseNow = createVector(mouseX, mouseY);
		var distMouse = this.pos.dist(mouseNow);
		var hover = distMouse <=100;
		if (hover == true) { //transform trigger
			this.state = 1;
		}
	}else if (this.state == 1) {	//transform state
		if (this.upDown == true) {
			this.transform = this.transform +4;
			if (this.transform >= 100) { 
				this.state = 2;
			}
		}else if (this.upDown == false) {
			this.transform = this.transform -4; 
			if (this.transform <=0) {
				this.upDown = true;
				this.state = 0;
			}
		}
	}else if (this.state == 2) { //fly state
		this.flyTime = this.flyTime +1;
		if (this.flyTime >= 100) {
			this.state = 1;
			this.upDown = false;
			//this.transform = 0;
			this.flyTime = 0;
		}
		
		var x = bezierPoint(this.posFlyto[0].x,this.posFlyto[1].x,this.posFlyto[2].x,this.posFlyto[0].x,this.flyTime/100);
		var y = bezierPoint(this.posFlyto[0].y,this.posFlyto[1].y,this.posFlyto[2].y,this.posFlyto[0].y,this.flyTime/100);
		this.pos.x =x;
		this.pos.y =y;
		var tx = bezierTangent(this.posFlyto[0].x,this.posFlyto[1].x,this.posFlyto[2].x,this.posFlyto[0].x,this.flyTime/100);
  		var ty = bezierTangent(this.posFlyto[0].y,this.posFlyto[1].y,this.posFlyto[2].y,this.posFlyto[0].y,this.flyTime/100);
  		this.a = atan2(ty, tx);
  		this.a += PI/2;
  		
  		// stroke('rgba(0,0,0,0.25)');
  		noFill();
  		bezier(this.posFlyto[0].x,this.posFlyto[0].y,this.posFlyto[1].x,this.posFlyto[1].y,this.posFlyto[2].x,this.posFlyto[2].y,this.posFlyto[0].x,this.posFlyto[0].y);

	}
	}

}




