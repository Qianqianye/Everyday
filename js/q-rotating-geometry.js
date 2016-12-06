
            if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
            var camera, scene, renderer;
            var geometry, material, mesh;
            var mouse = {x: 0, y: 0};
            var scene = new THREE.Scene(); // initialising the scene
            scene.background = new THREE.Color( 0xffffff );
            document.addEventListener( 'mousemove', onMouseMove, false );

            function setup() {
                var W = window.innerWidth, H = window.innerHeight;
                renderer = new THREE.WebGLRenderer( { alpha: true } );
                renderer.setSize( W, H );
                renderer.setClearColor( 0x000000, 0 ); // the default
                document.body.appendChild( renderer.domElement );
                renderer.domElement.id = "CanvasThreeJS";

                camera = new THREE.PerspectiveCamera( 10, W/H, 0.01, 10000 );
                camera.position.set( 0, 0, 100 );

                geometry = new THREE.OctahedronGeometry(3, 0);
                material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading, wireframe: true, wireframeLinewidth: 1, transparent: true, opacity: 0.44});
                mesh = new THREE.Mesh(geometry, material);
                // mesh.position.x = 0;
                // mesh.position.y = 0;
                scene.add(mesh);
            }

            function onMouseMove(event) {
                event.preventDefault();
                mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

                // Make the geometry follow the mouse
                var vector = new THREE.Vector3(mouse.x, mouse.y, 0);

                vector.unproject( camera );
                var dir = vector.sub( camera.position ).normalize();
                var distance = - camera.position.z / dir.z;

                var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

                mesh.position.copy(pos);

            };

            function draw() {

                requestAnimationFrame( draw );
                mesh.rotation.x = Date.now() * 0.0005;  
                mesh.rotation.y = Date.now() * 0.0002;  
                mesh.rotation.z = Date.now() * 0.001;
                geometry = new THREE.CubeGeometry( 25, 25, 25 );
                renderer.render( scene, camera );
            }

            setup();
            draw();
