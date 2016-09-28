var mesh, renderer, scene, camera, controls;

init();
render();

function init() {

	// info
	info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.bottom = '25px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.style.color = '#fff';
	info.style.fontWeight = 'bold';
	info.style.backgroundColor = 'transparent';
	info.style.zIndex = '1';
	info.style.fontFamily = 'Monospace';
	info.innerHTML = 'Refresh Page to See New Isometric<br/>Drag Mouse to Rotate Camera';
	document.body.appendChild( info );

	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// scene
	scene = new THREE.Scene();

	// camera
	var aspect = window.innerWidth / window.innerHeight;
	var d = 50;
	camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );

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

	// axes ///////
	// scene.add( new THREE.AxisHelper( 40 ) );

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
		// var material = new THREE.MeshLambertMaterial( { color: 0xffffff, overdraw: 0.5 } );
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

