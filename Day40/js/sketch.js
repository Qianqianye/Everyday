if ( WEBVR.isAvailable() === false ) {
      document.body.appendChild( WEBVR.getMessage() );

    }

var vertexHeight = 15000;
var planeDefinition = 100;
var planeSize = 1245000;
var totalObjects = 100000;

var container = document.createElement('div');
document.body.appendChild( container );

var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight,1, 400000)
camera.position.z = 550000;
camera.position.y =10000;
camera.lookAt( new THREE.Vector3(0,6000,0) );

var scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x000000, 1, 300000 );

renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

        
controls = new THREE.VRControls( camera );
 effect = new THREE.VREffect(  renderer );
        if ( navigator.getVRDisplays ) {
          navigator.getVRDisplays()
            .then( function ( displays ) {
              effect.setVRDisplay( displays[ 0 ] );
              controls.setVRDisplay( displays[ 0 ] );
            } )
            .catch( function () {
              // no displays
            } );
          document.body.appendChild( WEBVR.getButton( effect ) );
        }

var plane = new THREE.Mesh( new THREE.PlaneGeometry( planeSize, planeSize, planeDefinition, planeDefinition ), new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } ) );

plane.rotation.x -=Math.PI*.5;

scene.add( plane );

var geometry = new THREE.Geometry();
sprite = new THREE.TextureLoader().load( "image/planet-4.png" );

for (i = 0; i < totalObjects; i ++) 
{ 
  var vertex = new THREE.Vector3();
  vertex.x = Math.random()*planeSize-(planeSize*.5);
  vertex.y = Math.random()*100000;
  vertex.z = Math.random()*planeSize-(planeSize*.5);
  geometry.vertices.push( vertex );
}

var material = new THREE.PointsMaterial( { size: 1500, map: sprite,  alphaTest: 0.2, });
var particles = new THREE.Points( geometry, material );   
scene.add( particles ); 

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );
updatePlane();

 function updatePlane() { 
   for (var i = 0; i < plane.geometry.vertices.length; i++) 
   { 
     plane.geometry.vertices[i].z += Math.random()*vertexHeight -vertexHeight; 
   } 
 };



function render() {
        requestAnimationFrame( render );
        camera.position.z -= 150;
        renderer.render( scene, camera );
      }

render();

function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      effect.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

      controls.update();

      effect.render( scene, camera );

      effect.requestAnimationFrame( animate );

    }
