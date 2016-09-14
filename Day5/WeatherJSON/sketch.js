var weather;

var xPos;
var yPos;
var xDir;
var yDir;
var colorR;
var colorG;
var colorB;

var UpdateTime = 0;



var windChillPercentage;
var windSpeedPercentage;
var windDirectionRadians;


function preload() {

  reloadWeather();


}


function reloadWeather() {

  var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22sanFrancisco%2C%20CA%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

  var weatherN = loadJSON(url,weatherToPercent);
  println('Reloading now');
  UpdateTime = minute();
  weather = weatherN;
  

}

function setup() {
  createCanvas(800, 800);

  noStroke();
  colorR = 255;
  colorG = 0;
  colorB = 0;

  xPos = width / 2;
  yPos = height / 2;


}



function weatherToPercent(){
  //Weather Stuffs

  var main = weather.query.results.channel;
  var windSpeed = main.wind.speed;
  var windChill = main.wind.chill;
  var windDirection = main.wind.direction;

  fill(50);
  text("Speed : " + windSpeed, 20, 20);
  text("Chill : " + windChill, 20, 40);
  text("Direction : " + windDirection, 20, 60);

    println("Speed : " + windSpeed);
  println("Chill : " + windChill);
  println("Direction : " + windDirection);


  windChillPercentage = map(windChill, 45, 80, 0, 100);
  windSpeedPercentage = map(windSpeed, 0, 30, 0, 100);
  windDirectionRadians = map(windDirection, 0, 360, 0, 6.28318530718);

// Weather Stuff
}



function draw() {



  if (minute() != UpdateTime) {
    reloadWeather();
    UpdateTime = minute();
    println(minute() + ' ' + UpdateTime);
  }


  //-------------drawing the ball below ----//

  xDir = sin(windDirectionRadians) * windSpeedPercentage / 1000;
  yDir = cos(windDirectionRadians) * windSpeedPercentage / 1000;

  xPos = xPos + xDir;
  yPos = yPos + yDir;

  if (xPos <= 0 || xPos >= width || yPos <= 0 || yPos >= height) {
    xPos = width / 2;
    yPos = height / 2;
  }


  var colorN = ColorPick(windChillPercentage);
  fill(colorN);
  ellipse(xPos, yPos, 5, 5);


  /// end of drawing the ball ///

}



function ColorPick(PercentCold) {

  fromColor = color(128, 204, 255);
  toColor = color(204, 0, 0);
  colorMode(RGB);
  interA = lerpColor(fromColor, toColor, PercentCold / 100);
  return interA;

}