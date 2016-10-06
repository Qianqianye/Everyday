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

        // var ambient = new THREE.AmbientLight( 0x444444 );
        // scene.add( ambient );
        // var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        // directionalLight.position.set( 10, 0, 1 ).normalize();
        // scene.add( directionalLight );

        scene.add( new THREE.HemisphereLight( 0x999999, 0x555555 ) );
        addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
        addShadowedLight( 0.5, 1, -1, 0xffffff, 1 );

        sphere = new THREE.Mesh( new THREE.TorusGeometry(120, 60, 40, 40, 6.28), new THREE.MeshNormalMaterial() );
        // sphere = new THREE.Mesh( new THREE.TorusGeometry(80, 40, 40, 40, 6.28), new THREE.MeshBasicMaterial( { shading: THREE.FlatShading, color: 0xdddddd,  wireframe: true, wireframeLinewidth: 0.1, transparent: true } ) );
        scene.add( sphere );

        // var geometry = new THREE.CylinderGeometry( 0, 4, 40, 4, 1 );
        //       geometry.rotateX( Math.PI / 2 );
        // var material = new THREE.MeshNormalMaterial();

        var material = new THREE.MeshBasicMaterial( { shading: THREE.FlatShading, color: 0xdddddd,  wireframe: true, wireframeLinewidth: 0.5, transparent: true } );

        var loader = new THREE.OBJLoader();
        loader.load( "model/hand_01.obj", function( geometry ){
        geometry.rotateX( Math.PI / 2 );
        var  i, j, instance;       
        var material = new THREE.MeshBasicMaterial( { shading: THREE.FlatShading, color: 0xdddddd,  wireframe: true, wireframeLinewidth: 0.5, transparent: true } );

       var mesh = new THREE.Mesh( geometry,material );
        for ( i = 0; i < 100; i ++ ) {
       // for ( j = 0; j < 15; j += 3 ) {
        instance = geometry.clone();

         // instance.position.set( 100*j, 0, 105*i);
        instance.position.x = Math.random() * 4000 - 2000;
        instance.position.y = Math.random() * 4000 - 2000;
        instance.position.z = Math.random() * 4000 - 2000;
        // instance.scale.x = instance.scale.y = instance.scale.z = Math.random() * 2 + 1;
        instance.scale.x = instance.scale.y = instance.scale.z = -1.5;
        scene.add( instance );
      
    }
  });

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

      function addShadowedLight( x, y, z, color, intensity ) {
        var directionalLight = new THREE.DirectionalLight( color, intensity );
        directionalLight.position.set( x, y, z );
        scene.add( directionalLight );
        directionalLight.castShadow = true;
        var d = 1;
        directionalLight.shadow.camera.left = -d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = -d;
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 4;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.bias = -0.005;
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
        var time = Date.now() * 0.003;
        sphere.rotation.x = time;  
        sphere.rotation.y = time;  
        sphere.rotation.z = time;

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