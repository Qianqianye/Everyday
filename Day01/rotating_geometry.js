			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
			var camera, scene, renderer;
			var geometry, material, mesh;


			var scene = new THREE.Scene(); // initialising the scene
			scene.background = new THREE.Color( 0xffffff );

			function setup() {
				var W = window.innerWidth, H = window.innerHeight;
				renderer = new THREE.WebGLRenderer();
				renderer.setSize( W, H );
				document.body.appendChild( renderer.domElement );

				camera = new THREE.PerspectiveCamera( 50, W/H, 1, 10000 );
				camera.position.z = 500;
				
				geometry = new THREE.OctahedronGeometry(150, 0);
				material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading, wireframe: true, wireframeLinewidth: 1, transparent: true, opacity: 0.44});
				mesh = new THREE.Mesh(geometry, material);
				scene.add(mesh);
			}

			function draw() {

				requestAnimationFrame( draw );
				
				// experiment with code from the snippets menu here
				mesh.rotation.x = Date.now() * 0.0005;	
				mesh.rotation.y = Date.now() * 0.0002;	
				mesh.rotation.z = Date.now() * 0.001;
				
				geometry = new THREE.CubeGeometry( 25, 25, 25 );
				renderer.render( scene, camera );
			}
			
			setup();
			draw();