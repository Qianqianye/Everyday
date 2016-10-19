var allObjects = 400;
var objectSize = 50;
var sizeRandomness = 200;
var movementSpeed = 25;
var colors = [0xFFFFFF, 0x7bb3ff, 0xe86af0, 0x9e379f, 0x493267, 0xff8b94];
var dirs = [];
var parts = [];
var container = document.createElement('div');
document.body.appendChild( container );

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,1, 10000)
camera.position.z = 1000; 
var sprite;

var scene = new THREE.Scene(); 

function ExplodeAnimation(x,y){
  geometry = new THREE.Geometry();
  // sprite = new THREE.TextureLoader().load( "image/sphere.png" );
  sprite = new THREE.TextureLoader().load( "image/brain.png" );
  
  for (i = 0; i < allObjects; i ++) 
  { 
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = 0;
    geometry.vertices.push( vertex );
    dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }
  var material = new THREE.PointsMaterial( { size: objectSize, map: sprite,  alphaTest: 0.5, color: colors[Math.floor(Math.random() * colors.length)] });
  var particles = new THREE.Points( geometry, material );
  
  this.object = particles;
  this.status = true;
  
  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  
  scene.add( this.object  ); 
  
  this.update = function(){
    if (this.status == true){
      var pCount = allObjects;
      while(pCount--) {
        var particle =  this.object.geometry.vertices[pCount]
        particle.y += dirs[pCount].y;
        particle.x += dirs[pCount].x;
        particle.z += dirs[pCount].z;
      }
      this.object.geometry.verticesNeedUpdate = true;
    }
  }
}

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild( renderer.domElement );

renderer.render( scene, camera );
parts.push(new ExplodeAnimation(0, 0));
render();

function render() {
  requestAnimationFrame(render);
  var pCount = parts.length;
  while(pCount--) {
    parts[pCount].update();
  }
  renderer.render( scene, camera );
}

window.addEventListener( 'mousedown', onclick, false );
window.addEventListener( 'resize', onWindowResize, false );

function onclick(){
  event.preventDefault();
  parts.push(new ExplodeAnimation((Math.random() * sizeRandomness)-(sizeRandomness/2), (Math.random() * sizeRandomness)-(sizeRandomness/2)));
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

}