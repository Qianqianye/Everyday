var blobCount = 10;
  var mouse;
function randy(min, max) {
  return Math.floor(Math.random() * (1 + max - min) + min);
}
var time = 10,
    tl = new TimelineMax({repeat: -1,yoyo:false}),
    container = document.getElementById("container");
for (var i = 0; i < blobCount; i++) {
  var div = document.createElement("div");
  container.appendChild(div);
}

function draw(){

var blobs = container.children;
initSettings = [];
for (var i = 0; i < blobs.length; i++) {
  var init = {};
  init.rot = randy(-2500,2500);
  // init.rotX = mouseX;
  // init.rotY = mouseY;
  init.rotX = randy(-2500,2500);
  init.rotY = randy(-2500,2500);
  init.rotZ = randy(-2500,2500);
  // init.left = randy(-40,130) + "%";
  // init.top = randy(-40,130) + "%";
  init.left = mouseX+"%";
  init.top = mouseY+"%";
  initSettings.push(init);
  tl.set(blobs[i], {
    rotation: init.rot,
    rotationX: init.rotX,
    rotationY: init.rotY,
    rotationZ: init.rotZ,
    left: init.left,
    top: init.top,
  });
}
for (var i = 0; i < blobs.length; i++) {
  tl.to(blobs[i], time*1, {
    rotation: "+="+36,
    rotationX: "+="+36,
    rotationY: "+="+36,
    rotationZ: "+="+36,
    ease: Power0.easeNone
  }, 0);
}
for (var i = 0; i < blobs.length; i++) {
  tl.to(blobs[i], time*20, {
    left: randy(-40,130) + "%",
    ease: Sine.easeInOut
  }, 0);
}
for (var i = 0; i < blobs.length; i++) {
  tl.to(blobs[i], time, {
    top: randy(-40,130) + "%",
    ease: Sine.easeInOut
  }, 0);
}
for (var i = 0; i < blobs.length; i++) {
  tl.to(blobs[i], time*20, {
    top: randy(-40,130) + "%",
    ease: Sine.easeInOut
  }, time);
}
for (var i = 0; i < blobs.length; i++) {
  tl.to(blobs[i], time*20, {
    left: randy(-40,130) + "%",
    ease: Sine.easeInOut
  }, time*2);
}
for (var i = 0; i < blobs.length; i++) {
  tl.to(blobs[i], time*20, {
    top: randy(-40,130) + "%",
    ease: Sine.easeInOut
  }, time*3);
}
for (var i = 0; i < blobs.length; i++) {
  tl.to(blobs[i], time*20, {
    left: initSettings[i].left,
    ease: Sine.easeInOut
  }, time*4);
}
for (var i = 0; i < blobs.length; i++) {
  tl.to(blobs[i], time, {
    top: initSettings[i].top,
    ease: Sine.easeInOut
  }, time*5);
}

}