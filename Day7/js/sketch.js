
            if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
            var camera, scene, renderer;
            var geometry, material, mesh;
            document.addEventListener( 'mousemove', onMouseMove, false );


            function setup() {
                var W = window.innerWidth, H = window.innerHeight;
                renderer = new THREE.WebGLRenderer();
                renderer.setSize( W, H );
                document.body.appendChild( renderer.domElement );

                camera = new THREE.PerspectiveCamera( 10, W/H, 0.01, 10000 );
                camera.position.set( 0, 0, 100 );
                scene = new THREE.Scene();

                
                geometry = new THREE.OctahedronGeometry(3, 0);
                material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading, wireframe: true, wireframeLinewidth: 1, transparent: true, opacity: 0.44});
                mesh = new THREE.Mesh(geometry, material);
                // mesh.position.x = 0;
                // mesh.position.y = 0;
                scene.add(mesh);
            }

            function onMouseMove(event) {
                mesh.position.set(event.clientX* 0.01, event.clientY* -0.01, 0);
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
