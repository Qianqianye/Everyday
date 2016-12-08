
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
var controls = new THREE.VRControls(camera);
controls.standing = true;
controls.standing = true;

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Add a repeating grid as a skybox.
var boxSize = 100;
var loader = new THREE.TextureLoader();
loader.load('img/box.png', onTextureLoaded);

function onTextureLoaded(texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(boxSize, boxSize);

  var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0x01BE00,
    side: THREE.BackSide
  });

  // Align the skybox to the floor (which is at y=0).
  skybox = new THREE.Mesh(geometry, material);
  skybox.position.y = boxSize/2;
  scene.add(skybox);

  // For high end VR devices like Vive and Oculus, take into account the stage
  // parameters provided.
  setupStage();
}

// Create a VR manager helper to enter and exit VR mode.
var params = {
  hideButton: false, 
  isUndistorted: false 
};
var manager = new WebVRManager(renderer, effect, params);


//---QQQQ------------------
var vertexHeight = 0.5;
var planeDefinition = 10;
var planeSize = 2

var plane = new THREE.Mesh( new THREE.PlaneGeometry( planeSize, planeSize, planeDefinition, planeDefinition ), new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } ) );
scene.add( plane );
for (var i = 0; i < plane.geometry.vertices.length; i++) 
{ 
 plane.geometry.vertices[i].z += Math.random()*vertexHeight -vertexHeight; 
} 


//---QQQQ------------------

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

// Request animation frame loop function
var lastRender = 0;
function animate(timestamp) {
  var delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  plane.rotation.x += delta * 0.0006;

  controls.update();
  // Render the scene through the manager.
  manager.render(scene, camera, timestamp);
  effect.render(scene, camera);
  vrDisplay.requestAnimationFrame(animate);
}

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

var vrDisplay;

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
function setupStage() {
  navigator.getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
      vrDisplay = displays[0];
      if (vrDisplay.stageParameters) {
        setStageDimensions(vrDisplay.stageParameters);
      }
      vrDisplay.requestAnimationFrame(animate);
    }
  });
}

function setStageDimensions(stage) {
  // Make the skybox fit the stage.
  var material = skybox.material;
  scene.remove(skybox);

  // Size the skybox according to the size of the actual stage.
  var geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
  skybox = new THREE.Mesh(geometry, material);

  // Place it on the floor.
  skybox.position.y = boxSize/2;
  scene.add(skybox);

  // Place the geometry in the middle of the scene, at user height.

  plane.position.set(0, controls.userHeight, 0);
}