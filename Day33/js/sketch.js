var vertexHeight = 130;
var Definition = 70;
var Size = 1500;
var frame = 0;
var mouse = {x: 0, y: 0};
var plane;
var container = document.createElement('div');
document.body.appendChild( container );
document.addEventListener( 'mousemove', onMouseMove, false );

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight,10, 6000)
camera.position.z = 4000; 

var scene = new THREE.Scene();

var uniforms = 
{
  time: { type: "f", value: 0.0 }
};

var material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: document.getElementById( 'vertexShader' ).textContent,
  fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
  wireframe: false
} );

var plane = new THREE.Mesh( new THREE.SphereGeometry( Size, Definition, Definition ), material );
scene.add( plane );

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild( renderer.domElement );

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

                var vector = new THREE.Vector3(mouse.x, mouse.y, 0);
                vector.unproject( camera );
                var dir = vector.sub( camera.position ).normalize();
                var distance = - camera.position.z / dir.z;
                var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
                plane.position.copy(pos);
                
              };

 function render() {
    requestAnimationFrame( render );
    // plane.rotation.x = Date.now() * 0.0005;  
    // plane.rotation.y = Date.now() * 0.0002;  
    // plane.rotation.z = Date.now() * 0.001;
    uniforms.time.value = frame;
    frame += .15;
    renderer.render( scene, camera );
              }

              render();