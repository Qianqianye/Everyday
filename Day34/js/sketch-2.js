var vertexHeight = 15000;
var planeDefinition = 100;
var planeSize = 1245000;
var totalObjects = 50000;
var frame = 0;

var container = document.createElement('div');
document.body.appendChild( container );

var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight,1, 400000)
camera.position.z = 550000;
camera.position.y =10000;
camera.lookAt( new THREE.Vector3(0,6000,0) );


var scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x23233f, 1, 300000 );

var uniforms = 
    {
      time: { type: "f", value: 0.0 }
    };


    var material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
                    vertexShader: document.getElementById( 'vertexShader' ).textContent,    
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            wireframe: true,
    fog: false
                } );



var plane = new THREE.Mesh( new THREE.PlaneGeometry( planeSize, planeSize, planeDefinition, planeDefinition ), material );
plane.rotation.x -=Math.PI*.5;

scene.add( plane );

var geometry = new THREE.Geometry();

for (i = 0; i < totalObjects; i ++) 
{ 
  var vertex = new THREE.Vector3();
  vertex.x = Math.random()*planeSize-(planeSize*.5);
  vertex.y = (Math.random()*100000)+10000;
  vertex.z = Math.random()*planeSize-(planeSize*.5);
  geometry.vertices.push( vertex );
}

var material = new THREE.ParticleBasicMaterial( { size: 200 });
var particles = new THREE.ParticleSystem( geometry, material );
     
scene.add( particles ); 

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild( renderer.domElement );


render();

            function render() {
        requestAnimationFrame( render );
        camera.position.z -= 150;
           uniforms.time.value = frame;
        frame += .04;
       //  dateVerts();
        renderer.render( scene, camera );
            }