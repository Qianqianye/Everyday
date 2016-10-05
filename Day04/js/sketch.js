var mesh, renderer, scene, camera, controls;

init();
render();

function init() {
	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// scene
	scene = new THREE.Scene();

	// camera
	var aspect = window.innerWidth / window.innerHeight;
	var d = 50;
	camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d+6, - d, 1, 1000 );

	//set the x-component of rotation
		camera.position.set( 200, 200, 200 );
		camera.rotation.order = 'YXZ';
		camera.rotation.y = - Math.PI / 4;
		camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );


	// controls
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', render );
		controls.enableZoom = false;
		controls.enablePan = false;
		controls.maxPolarAngle = Math.PI / 2;

	// ambient
		scene.add( new THREE.AmbientLight( 0x444444 ) );

	// light
		var light = new THREE.PointLight( 0xffffff, 0.8 );
		light.position.set( 0, 50, 50 );
		scene.add( light );

	// grid
		var geometry = new THREE.PlaneBufferGeometry( 100, 100, 20, 20 );
		var material = new THREE.MeshBasicMaterial( { wireframe: true, opacity: 0.3, transparent: true } );
		var grid = new THREE.Mesh( geometry, material );
		grid.rotation.order = 'YXZ';
		grid.rotation.y = - Math.PI / 2;
		grid.rotation.x = - Math.PI / 2;
		scene.add( grid );

	// geometry

		var geometry = new THREE.BoxGeometry( 5, 5, 5 );
		var material = new THREE.MeshNormalMaterial();

			for ( var i = 0; i < 100; i ++ ) {

				var mesh = new THREE.Mesh( geometry, material );

				mesh.scale.y = Math.floor( Math.random() * 2 + 1 );
				mesh.position.x = Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 5 + 5 ;
				// mesh.position.y = ( mesh.scale.y * 50 ) / 2;
				mesh.position.y = 5
				mesh.position.z = Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 5 + 5 ;

				scene.add( mesh );
					}

}

	function render() {
		renderer.render( scene, camera );
	}

	function refreshPage(){
    window.location.reload();
	} 

