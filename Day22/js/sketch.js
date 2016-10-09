			var WIDTH = window.innerWidth;
			var HEIGHT = window.innerHeight;
			var VIEW_ANGLE = 45;
			var ASPECT = WIDTH / HEIGHT;
			var NEAR = 1;
			var FAR = 500;
			var camera, scene, renderer;
			var cameraControls;
			var verticalMirror, groundMirror;
			var sphereGroup, heart, smallSphere;
			var loaded = false;
			
			function init() {
				// renderer
				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( WIDTH, HEIGHT );
				// scene
				scene = new THREE.Scene();
				// camera
				camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
				// camera.position.set( 0, 25, 120 );
				camera.position.set( 145, 52, 145 );
				cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
				cameraControls.target.set( 0, 52, 0);
				cameraControls.maxDistance = 400;
				cameraControls.minDistance = 10;
				cameraControls.update();
				var container = document.getElementById( 'container' );
				container.appendChild( renderer.domElement );
			}

			function fillScene() {
				var planeGeo = new THREE.PlaneBufferGeometry( 100.1, 100.1 );
				// MIRROR planes
				groundMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: WIDTH, textureHeight: HEIGHT, color: 0x777777 } );
				var mirrorMesh = new THREE.Mesh( planeGeo, groundMirror.material );

				mirrorMesh.add( groundMirror );
				mirrorMesh.rotateX( - Math.PI / 2 );
				scene.add( mirrorMesh );
				verticalMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: WIDTH, textureHeight: HEIGHT, color:0x999999 } );
				
				// var verticalMirrorMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ), verticalMirror.material );
				var verticalMirrorMesh = new THREE.Mesh( planeGeo, verticalMirror.material  );

				verticalMirrorMesh.add( verticalMirror );
				verticalMirrorMesh.position.y = 50;
				verticalMirrorMesh.position.z = -49.9;
				scene.add( verticalMirrorMesh );

				var verticalMirrorMesh2 = new THREE.Mesh( planeGeo, verticalMirror.material  );
				verticalMirrorMesh2.add( verticalMirror );
				verticalMirrorMesh2.position.x = -49.9;
				verticalMirrorMesh2.position.y = 50;
				verticalMirrorMesh2.rotateY( Math.PI / 2 );
				scene.add( verticalMirrorMesh2 );


				var planeRight = new THREE.Mesh( planeGeo, verticalMirror.material  );
				planeRight.position.x = 49.9;
				planeRight.position.y = 50;
				planeRight.rotateY( - Math.PI / 2 );
				scene.add( planeRight );

				// load the heart
				var loader = new THREE.STLLoader();
				loader.load( 'model/heart.stl', function ( geometry ) {
				var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x555555, shading: THREE.FlatShading } );
				heart = new THREE.Mesh( geometry, material );
				heart.scale.set( 0.4, 0.4, 0.4 );
				heart.position.y = 80;
				scene.add( heart );
				loaded = true;
				} );


				// ball
				// var geometry = new THREE.SphereGeometry(3, 100, 100);
				// var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, shading: THREE.FlatShading } );
				// smallSphere = new THREE.Mesh( geometry, material );
				// scene.add(smallSphere);

				// walls
				var planeTop = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
				planeTop.position.y = 100;
				planeTop.rotateX( Math.PI / 2 );
				scene.add( planeTop );
				var planeBack = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
				planeBack.position.z = -50;
				planeBack.position.y = 50;
				scene.add( planeBack );
				var planeFront = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
				planeFront.position.z = 50;
				planeFront.position.y = 50;
				planeFront.rotateY( Math.PI );
				scene.add( planeFront );
				// var planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
				// planeRight.position.x = 50;
				// planeRight.position.y = 50;
				// planeRight.rotateY( - Math.PI / 2 );
				// scene.add( planeRight );

				var planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
				planeLeft.position.x = -50;
				planeLeft.position.y = 50;
				planeLeft.rotateY( Math.PI / 2 );
				scene.add( planeLeft );

				// lights	
				var mainLight = new THREE.PointLight( 0xbbbbbb, 1, 1000 );
				mainLight.position.y = 90;
				mainLight.position.z = 100;
				scene.add( mainLight );

					function createLight( color ) {
					var pointLight = new THREE.PointLight( color, 35, 30 );
					pointLight.castShadow = true;
					pointLight.shadow.camera.near = 1;
					pointLight.shadow.camera.far = 30;
					// pointLight.shadowCameraVisible = true;
					pointLight.shadow.bias = 0.01;
					var geometry = new THREE.SphereGeometry( 0.1, 12, 6 );
					var material = new THREE.MeshBasicMaterial( { color: color } );
					var sphere = new THREE.Mesh( geometry, material );
					pointLight.add( sphere );
					return pointLight
				}
				pointLight = createLight( 0xffffff );
				scene.add( pointLight );
				pointLight2 = createLight( 0xff0000 );
				scene.add( pointLight2 );

			}
			function render() {
				var time = performance.now() * 0.001;
				pointLight.position.x = Math.sin( time ) * 9;
				pointLight.position.y = Math.sin( time * 1.1 ) * 9 + 25;
				pointLight.position.z = Math.sin( time * 1.2 ) * 9;
				time += 10000;
				pointLight2.position.x = Math.sin( time ) * 9;
				pointLight2.position.y = Math.sin( time * 1.1 ) * 9 + 25;
				pointLight2.position.z = Math.sin( time * 1.2 ) * 9;

				groundMirror.renderWithMirror( verticalMirror );
				verticalMirror.renderWithMirror( groundMirror );
				renderer.render(scene, camera);
			}
			function update() {
				requestAnimationFrame( update );
				var timer = Date.now() * 0.01;
				
				if (loaded == true){
					heart.position.set(
					Math.cos( timer * 0.1 ) * 30,
					Math.abs( Math.cos( timer * 0.2 ) ) * 20 + 25,
					Math.sin( timer * 0.1 ) * 30
				);

					heart.rotation.x = timer * 0.4;
					heart.rotation.y = timer * 0.6;
					heart.rotation.z = timer * 0.4;
				}

				cameraControls.update();
				render();
			}
			init();
			fillScene();
			update();