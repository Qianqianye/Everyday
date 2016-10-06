      var container, stats;
      var camera, scene, renderer;
      var mesh, geometry, sphere;
      var mouseX = 0, mouseY = 0;
      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;
      document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      init();
      animate();

      function init() {
        container = document.createElement( 'div' );
        document.body.appendChild( container );
        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 15000 );
        camera.position.z = 3200;
        scene = new THREE.Scene();
        // sphere = new THREE.Mesh( new THREE.SphereGeometry( 100, 20, 20 ), new THREE.MeshNormalMaterial() );
        // sphere = new THREE.Mesh( new THREE.TorusGeometry(80, 40, 40, 40, 6.28), new THREE.MeshNormalMaterial() );
        sphere = new THREE.Mesh( new THREE.TorusGeometry(80, 40, 40, 40, 6.28), new THREE.MeshBasicMaterial( { shading: THREE.FlatShading, color: 0xdddddd,  wireframe: true, wireframeLinewidth: 0.1, transparent: true } ) );
        scene.add( sphere );

        // var geometry = new THREE.CylinderGeometry( 0, 4, 40, 4, 1 );
        // geometry.rotateX( Math.PI / 2 );
        // // var material = new THREE.MeshNormalMaterial();
        // var material = new THREE.MeshBasicMaterial( { shading: THREE.FlatShading, color: 0xdddddd,  wireframe: true, wireframeLinewidth: 0.5, transparent: true } );
        // for ( var i = 0; i < 500; i ++ ) {
        //   var mesh = new THREE.Mesh( geometry, material );
        //   mesh.position.x = Math.random() * 4000 - 2000;
        //   mesh.position.y = Math.random() * 4000 - 2000;
        //   mesh.position.z = Math.random() * 4000 - 2000;
        //   mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 4 + 2;
        //   scene.add( mesh );
        // }


        var ambient = new THREE.AmbientLight( 0x444444 );
        scene.add( ambient );
        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 0, 1 ).normalize();
        scene.add( directionalLight );


        // model
        var onProgress = function ( xhr ) {
          if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
          }
        };

        var onError = function ( xhr ) { };
        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath( 'model/' );
        mtlLoader.load( 'hand_01.mtl', function( material ) {
        material.preload();

          var objLoader = new THREE.OBJLoader();
          objLoader.setMaterials( material );
          objLoader.setPath( 'model/' );
          objLoader.load( 'hand_01.obj', function ( geometry ) {
            // object.position.y = - 95;
            scene.add( geometry );
          }, onProgress, onError );         
        });

      function callbackModel(  ) {
         var mesh = new THREE.Mesh( geometry, material );
          mesh.position.x = Math.random() * 4000 - 2000;
          mesh.position.y = Math.random() * 4000 - 2000;
          mesh.position.z = Math.random() * 4000 - 2000;
          // console.log( mesh.position.x +'i m here');
          mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 4 + 2;
          scene.add( mesh );

      }

      // var loader = new THREE.PLYLoader();
      //   loader.load( 'models/hand.ply', function ( geometry ) {
      //     geometry.computeFaceNormals();
      //     var material = new THREE.MeshStandardMaterial( { color: 0x0055ff } );
      //     var mesh = new THREE.Mesh( geometry, material );
      //     mesh.position.y = - 0.25;
      //     mesh.rotation.x = - Math.PI / 2;
      //     mesh.scale.multiplyScalar( 0.001 );
      //     mesh.castShadow = true;
      //     mesh.receiveShadow = true;
      //     scene.add( mesh );

      //     } );


        scene.matrixAutoUpdate = false;



        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setClearColor( 0x000000 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.sortObjects = false;
        container.appendChild( renderer.domElement );
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        //
        window.addEventListener( 'resize', onWindowResize, false );
      }

      function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }

      function onDocumentMouseMove(event) {
        mouseX = ( event.clientX - windowHalfX ) * 10;
        mouseY = ( event.clientY - windowHalfY ) * 10;
      }
      

      function animate() {
        requestAnimationFrame( animate );
        render();
        stats.update();
      }

      function render() {
        var time = Date.now() * 0.001;

        sphere.rotation.x = Date.now() * 0.005;  
        sphere.rotation.y = Date.now() * 0.002;  
        sphere.rotation.z = Date.now() * 0.001;

        sphere.position.x = Math.sin( time * 0.7 ) * 2000;
        sphere.position.y = Math.cos( time * 0.5 ) * 2000;
        sphere.position.z = Math.cos( time * 0.3 ) * 2000;
        for ( var i = 1, l = scene.children.length; i < l; i ++ ) {
          scene.children[ i ].lookAt( sphere.position );
        }
        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
      }