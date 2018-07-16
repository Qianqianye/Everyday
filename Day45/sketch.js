var num = 6;
var step = 0;
var mountains = [];


function setup() {
	createCanvas(windowWidth, windowHeight - 4);
	shanShui();
	

}

function draw() {
	background(255);
	noStroke();

	ellipse(100, 100, 80, 80);

	for (var i = 0; i < mountains.length; i++) {
		mountains[i].display();
	}

}

function shanShui() {
	for (var i = 0; i < num; i++) {
		mountains.push(new dotLine(i));
	 }
	 console.log(mountains.length);
}

function dotLine(_index) {

	var index = _index;

	var base = random (width); 
	var start = random (-width, width); 


	this.display = function (){


	 	for (var x = start; x < base + start; x++) {
			var nx = map(x, 0, width, 0, 20);
			var y = height * noise(nx+index*10);

			// var c = 255 * noise(0.01 * x, 0.5);
			// fill(c);

			var c = color('rgba(0, 0, 0,0.3)');
    		fill(c);

			var xoffset = map(mouseX, 0,width, -200,200) * (index+1) ;

			// ellipse (x+ xoffset, y, 5, 5*mouseY/y);

			var rad = 3;
			ellipse (x+ xoffset, y, rad, 5*rad);
			// line (x+ xoffset, y, x+ xoffset, y+200);
			// line (x, y, x, y+200);


			 // beginShape();
				//  for (var x = start; x < base + start; x++) {
				// var nx = map(x, 0, width, 0, 10);
				// var y = height * noise(nx+index*10);

				// // vertex(x+ xoffset, y);
				// vertex(x+ xoffset, y);
				//  }
 			// endShape();
	 	}
	}
}