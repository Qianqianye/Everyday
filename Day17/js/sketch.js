			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
			var renderer = new THREE.WebGLRenderer();
			var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 2000 );
			var controls = new THREE.OrbitControls( camera, renderer.domElement );
			var scene = new THREE.Scene();
			var matFloor = new THREE.MeshPhongMaterial();
			// var matBox = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
			var matBox = new THREE.MeshPhongMaterial( { color: 0xffffff } );
			var geoFloor = new THREE.BoxGeometry( 2000, 1, 2000 );
			var geoBox = new THREE.TetrahedronGeometry(2, 0);
			var mshFloor = new THREE.Mesh( geoFloor, matFloor );
			var mshBox = new THREE.Mesh( geoBox, matBox );
			var ambient = new THREE.AmbientLight( 0x111111 );
			var spotLight1 = createSpotlight( 0xfdfe02 );
			var spotLight2 = createSpotlight( 0x011efe );
			var spotLight3 = createSpotlight( 0xfe00f6 );
			var spotLight4 = createSpotlight( 0x11dd11 );
			var lightHelper1, lightHelper2, lightHelper3, lightHelper4;
			
			function init() {
					// info
				info = document.createElement( 'div' );
				info.style.position = 'absolute';
				info.style.top = '25px';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.style.color = '#fff';
				info.style.fontWeight = 'bold';
				info.style.backgroundColor = 'transparent';
				info.style.zIndex = '1';
				info.style.fontFamily = 'Monospace';
				info.innerHTML = '/ Fantome /</br>Created by <a href="http://qianqian-ye.com/" style="color: #b3ecec">Qianqian Ye</a>  Powered by <a href="https://threejs.org/examples/?q=light#webgl_lights_spotlights" style="color: #b3ecec">Three.js</a></br></br>Drag Mouse to Rotate Camera';
				document.body.appendChild( info );

				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.PCFSoftShadowMap;
				renderer.gammaInput = true;
				renderer.gammaOutput = true;
				camera.position.set( 46, 32, - 30 );
				spotLight1.position.set( 15, 40, 45 );
				spotLight2.position.set( 0, 40, 35 );
				spotLight3.position.set( - 15, 40, 45 );
				spotLight4.position.set( - 10, 40, 35 );
				matFloor.color.set( 0x808080 );
				mshFloor.receiveShadow = true;
				mshFloor.position.set( 0, 0, 0 );
				mshBox.castShadow = true;
				mshBox.receiveShadow = true;
				mshBox.position.set( 0, 5, 0 );

				scene.add( mshFloor );
				scene.add( mshBox );
				scene.add( ambient );
				scene.add( spotLight1, spotLight2, spotLight3, spotLight4 );
				scene.add( lightHelper1, lightHelper2, lightHelper3, lightHelper4 );
				document.body.appendChild( renderer.domElement );
				onResize();
				window.addEventListener( 'resize', onResize, false );
				controls.target.set( 0, 7, 0 );
				controls.maxPolarAngle = Math.PI / 2;
				controls.update();
			}
			function createSpotlight( color ) {
				var newObj = new THREE.SpotLight( color, 2 );
				newObj.castShadow = true;
				newObj.angle = 0.3;
				newObj.penumbra = 0.2;
				newObj.decay = 2;
				newObj.distance = 80;
				newObj.shadow.mapSize.width = 1024;
				newObj.shadow.mapSize.height = 1024;
				return newObj;
			}
			function onResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function tween( light ) {
				new TWEEN.Tween( light ).to( {
					angle: ( Math.random() * 0.7 ) + 0.1,
					penumbra: Math.random() + 1
				}, Math.random() * 3000 + 2000 )
				.easing( TWEEN.Easing.Quadratic.Out ).start();
				new TWEEN.Tween( light.position ).to( {
					x: ( Math.random() * 30 ) - 15,
					y: ( Math.random() * 10 ) + 15,
					z: ( Math.random() * 30 ) - 15
				}, Math.random() * 3000 + 2000 )
				.easing( TWEEN.Easing.Quadratic.Out ).start();
			}

			function animate() {
				tween( spotLight1 );
				tween( spotLight2 );
				tween( spotLight3 );
				tween( spotLight4 );
				setTimeout( animate, 5000 );
			}

			function render() {
				TWEEN.update();
				if ( lightHelper1 ) lightHelper1.update();
				if ( lightHelper2 ) lightHelper2.update();
				if ( lightHelper3 ) lightHelper3.update();
				if ( lightHelper4 ) lightHelper4.update();
				renderer.render( scene, camera );
				requestAnimationFrame( render );
				mshBox.rotation.x = Date.now() * 0.0005;	
				mshBox.rotation.y = Date.now() * 0.0002;	
				mshBox.rotation.z = Date.now() * 0.001;
			}
			init();
			render();
			animate();