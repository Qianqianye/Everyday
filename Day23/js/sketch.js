      var camera, scene, renderer;
      var controls;
      var particlesTotal = 512;
      var positions = [];
      var objects = [];
      var current = 0;
      init();
      animate();
      function init() {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
        camera.position.set( 1800, 400, 1400 );
        camera.lookAt( new THREE.Vector3() );
        scene = new THREE.Scene();
        var image = document.createElement( 'img' );
        image.addEventListener( 'load', function ( event ) {
          for ( var i = 0; i < particlesTotal; i ++ ) {
            var object = new THREE.CSS3DSprite( image.cloneNode() );
            object.position.x = Math.random() * 4000 - 2000,
            object.position.y = Math.random() * 4000 - 2000,
            object.position.z = Math.random() * 4000 - 2000;
            scene.add( object );
            objects.push( object );
          }
          transition();
        }, false );
        image.src = 'ballon.png';
        // Plane
        var amountX = 16;
        var amountZ = 32;
        var separation = 150;
        var offsetX = ( ( amountX - 1 ) * separation ) / 2;
        var offsetZ = ( ( amountZ - 1 ) * separation ) / 2;
        for ( var i = 0; i < particlesTotal; i ++ ) {
          var x = ( i % amountX ) * separation;
          var z = Math.floor( i / amountX ) * separation;
          var y = ( Math.sin( x * 0.5 ) + Math.sin( z * 0.5 ) ) * 200;
          positions.push( x - offsetX, y, z - offsetZ );
        }
       
        // Random
        for ( var i = 0; i < particlesTotal; i ++ ) {
          positions.push(
            Math.random() * 4000 - 2000,
            Math.random() * 4000 - 2000,
            Math.random() * 4000 - 2000
          );
        }
        // Sphere
        var radius = 1050;
        for ( var i = 0; i < particlesTotal; i ++ ) {
          var phi = Math.acos( -1 + ( 2 * i ) / particlesTotal );
          var theta = Math.sqrt( particlesTotal * Math.PI ) * phi;
          positions.push(
            radius * Math.cos( theta ) * Math.sin( phi ),
            radius * Math.sin( theta ) * Math.sin( phi ),
            radius * Math.cos( phi )
          );
        }
        //
        renderer = new THREE.CSS3DRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.domElement.style.position = 'absolute';
        document.getElementById( 'container' ).appendChild( renderer.domElement );
        //
        controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 0.5;
        //
        window.addEventListener( 'resize', onWindowResize, false );
      }
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
      function transition() {
        var offset = current * particlesTotal * 3;
        var duration = 2000;
        for ( var i = 0, j = offset; i < particlesTotal; i ++, j += 3 ) {
          var object = objects[ i ];
          new TWEEN.Tween( object.position )
            .to( {
              x: positions[ j ],
              y: positions[ j + 1 ],
              z: positions[ j + 2 ]
            }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();
        }
        new TWEEN.Tween( this )
          .to( {}, duration * 3 )
          .onComplete( transition )
          .start();
        current = ( current + 1 ) % 3;
      }
      function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        controls.update();
        var time = performance.now();
        for ( var i = 0, l = objects.length; i < l; i ++ ) {
          var object = objects[ i ];
          var scale = Math.sin( ( Math.floor( object.position.x ) + time ) * 0.002 ) * 0.3 + 1;
          object.scale.set( scale, scale, scale );
        }
        renderer.render( scene, camera );
      }
