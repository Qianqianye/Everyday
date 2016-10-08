			var WIDTH = window.innerWidth;
			var HEIGHT = window.innerHeight;
			// camera
			var VIEW_ANGLE = 45;
			var ASPECT = WIDTH / HEIGHT;
			var NEAR = 1;
			var FAR = 500;
			var camera, scene, renderer;
			var cameraControls;
			var verticalMirror, groundMirror;
			var sphereGroup, heart, smallSphere;
			// var heart;


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
				camera.position.set( 0, 40, 160 );
				// camera.position.set( 60, 60, 60 );
				cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
				cameraControls.target.set( 0, 40, 0);
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
				verticalMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: WIDTH, textureHeight: HEIGHT, color:0x889999 } );
				
				// var verticalMirrorMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ), verticalMirror.material );
				var verticalMirrorMesh = new THREE.Mesh( planeGeo, verticalMirror.material  );

				verticalMirrorMesh.add( verticalMirror );
				verticalMirrorMesh.position.y = 35;
				verticalMirrorMesh.position.z = -45;
				scene.add( verticalMirrorMesh );


				sphereGroup = new THREE.Object3D();
				scene.add( sphereGroup );

				// var geometry = new THREE.CylinderGeometry( 0.1, 15 * Math.cos( Math.PI / 180 * 30 ), 0.1, 24, 1 );
				// var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x444444 } );
				// var sphereCap = new THREE.Mesh( geometry, material );
				// sphereCap.position.y = -15 * Math.sin( Math.PI / 180 * 30 ) - 0.05;
				// sphereCap.rotateX(-Math.PI);

				// var geometry = new THREE.SphereGeometry( 15, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120 );
				// var halfSphere = new THREE.Mesh( geometry, material );
				// halfSphere.add( sphereCap );
				// halfSphere.rotateX( - Math.PI / 180 * 135 );
				// halfSphere.rotateZ( - Math.PI / 180 * 20 );
				// halfSphere.position.y = 7.5 + 15 * Math.sin( Math.PI / 180 * 30 );
				// sphereGroup.add( halfSphere );


				// var loader = new THREE.STLLoader();
				// loader.load( 'model/heart.stl', function ( geometry ) {
				// 	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, shading: THREE.FlatShading } );
				// 	var heart = new THREE.Mesh( geometry, material );
				// 	heart.rotateX( - Math.PI / 180 * 135 );
				// heart.rotateZ( - Math.PI / 180 * 20 );
				// // heart.position.y = 7.5 + 15 * Math.sin( Math.PI / 180 * 30 );
				// heart.position.y = 30;
				// 	// mesh.position.set( 0, - 0.25, 0.6 );
				// 	// mesh.rotation.set( 0, - Math.PI / 2, 0 );
				// 	heart.scale.set( 0.5, 0.5, 0.5 );
				// 	// mesh.castShadow = true;
				// 	// mesh.receiveShadow = true;
				
				// 	scene.add( heart );
				// } );

				var loader = new THREE.STLLoader();
				loader.load( 'model/heart.stl', function ( geometry ) {
					// var  i, j, instance; 
					var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, shading: THREE.FlatShading } );
					smallSphere = new THREE.Mesh( geometry, material );
				// 	heart.rotateX( - Math.PI / 180 * 135 );
				// heart.rotateZ( - Math.PI / 180 * 20 );
				// heart.position.y = 7.5 + 15 * Math.sin( Math.PI / 180 * 30 );
				smallSphere.position.y = 30;
					// mesh.position.set( 0, - 0.25, 0.6 );
					// mesh.rotation.set( 0, - Math.PI / 2, 0 );
					smallSphere.scale.set( 0.4, 0.4, 0.4 );
					// mesh.castShadow = true;
					// mesh.receiveShadow = true;


					scene.add( smallSphere );
					 

				} );




				// var geometry = new THREE.IcosahedronGeometry( 5, 0 );

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
				var planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
				planeRight.position.x = 50;
				planeRight.position.y = 50;
				planeRight.rotateY( - Math.PI / 2 );
				scene.add( planeRight );

				var planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
				planeLeft.position.x = -50;
				planeLeft.position.y = 50;
				planeLeft.rotateY( Math.PI / 2 );
				scene.add( planeLeft );

				// lights
				var mainLight = new THREE.PointLight( 0xcccccc, 1.5, 1000 );
				mainLight.position.y = 100;
				scene.add( mainLight );
			}
		
			function render() {
				// render (update) the mirrors
				groundMirror.renderWithMirror( verticalMirror );
				verticalMirror.renderWithMirror( groundMirror );
				renderer.render(scene, camera);
			}
			function update() {
				requestAnimationFrame( update );
				var timer = Date.now() * 0.01;
				sphereGroup.rotation.y -= 0.002;
				// smallSphere.position.set(
				// 	Math.cos( timer * 0.1 ) * 30,
				// 	Math.abs( Math.cos( timer * 0.2 ) ) * 20 + 5,
				// 	Math.sin( timer * 0.1 ) * 30
				// );
				smallSphere.rotation.y = ( Math.PI / 2 ) - timer * 0.1;
				smallSphere.rotation.z = timer * 0.8;

				// sphereGroup.rotation.y -= 0.002;
				// heart.position.set(
				// 	Math.cos( timer * 0.1 ) * 30,
				// 	Math.abs( Math.cos( timer * 0.2 ) ) * 20 + 5,
				// 	Math.sin( timer * 0.1 ) * 30
				// );

				// heart.rotation.y = ( Math.PI / 2 ) - timer * 0.1;
				// heart.rotation.z = timer * 0.8;


				// heart.rotation.x = Date.now() * 0.0005;	
				// heart.rotation.y = Date.now() * 0.0002;	
				// heart.rotation.z = Date.now() * 0.001;


				cameraControls.update();
				render();
			}
			init();
			fillScene();
			update();