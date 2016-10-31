function threejs() {
     this.shapeX = 0.5;
     this.shapeY = 100;
     this.shapeZ = 100;
     this.shapeColor = 0xffffff;
}

threejs.prototype.init = function init() {
     this.scene = new THREE.Scene();
     this.camera();
     this.renderer();
     this.light();
     this.floor();
     this.initShape();
     this.render();
};

threejs.prototype.camera = function camera() {
     this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
     this.camera.position.y = 500;
     this.camera.position.z = 500;
     this.camera.position.x = 500;
     this.camera.updateProjectionMatrix();
     this.camera.lookAt(this.scene.position);
};

threejs.prototype.renderer = function renderer() {
     this.renderer = new THREE.WebGLRenderer({antialias: true});
     this.renderer.setSize( window.innerWidth, window.innerHeight );
     this.renderer.setClearColor( 0x000000 , 1 );
     this.renderer.shadowMap.enabled = true;
     this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
     document.body.appendChild(this.renderer.domElement);
};

threejs.prototype.light = function light() {
     var shadowlight = new THREE.DirectionalLight( 0xffffff, 1.8 );
     shadowlight.position.set( 0, 200, 0 );
     shadowlight.castShadow = true;
     // shadowlight.shadowDarkness = 0.1;
     this.scene.add(shadowlight);

     var light = new THREE.DirectionalLight( 0xffffff, 1.8 );
     light.position.set( 60, 100, 20 );
     this.scene.add(light);
  
  var backLight = new THREE.DirectionalLight( 0xffffff, 1 );
     backLight.position.set( -40, 100, 20 );
     this.scene.add(backLight);
};

threejs.prototype.floor = function floor() {
     var geometry = new THREE.PlaneGeometry( 500, 500, 1, 1 );
     var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
     this.floor = new THREE.Mesh( geometry, material );
     this.floor.material.side = THREE.DoubleSide;
     this.floor.position.y =-100;
     this.floor.position.z =-100;
     this.floor.rotation.x = 90*Math.PI/180;
     this.floor.rotation.y = 0;
     this.floor.rotation.z = 0;
     this.floor.doubleSided = true;
    this.floor.receiveShadow = true;
     this.scene.add(this.floor);
};


threejs.prototype.initShape = function initShape() {
     this.myArray = new THREE.Group();
     this.rotateGroup = new THREE.Group();

     this.scene.add(this.myArray);
     this.scene.add(this.rotateGroup);

     for(var i=0;i<10;i++){
          this.geometry = new THREE.BoxGeometry( 80, 80, 80 );
          this.material = new THREE.MeshLambertMaterial({color : 0x999999, shading: THREE.FlatShading});
          this.shape = new THREE.Mesh(this.geometry, this.material);
          this.shape.castShadow = true;
          this.shape.receiveShadow = false;

          if(i==4){
               this.shape.position.x = 85;
               this.shape.position.y = 2*85;
               this.shape.position.z = 0;
               
          }else if(i==5){
               this.shape.position.x = 85;
               this.shape.position.y = 3*85;
               this.shape.position.z = 0;
          }else if(i==6){
               this.shape.position.x = 0;
               this.shape.position.y = 0;
               this.shape.position.z = 85;
          }else if(i==7){
               this.shape.position.x = 2*85;
               this.shape.position.y = 85;
               this.shape.position.z = 0;
          }else if(i==8){
               this.shape.position.x = 85;
               this.shape.position.y = 85;
               this.shape.position.z = 85;
          }else if(i==9){
               this.shape.position.x = 85*2;
               this.shape.position.y = 85*2;
               this.shape.position.z = 0;
          }else{
               this.shape.position.x = 0;
               this.shape.position.y = i*85;
               this.shape.position.z = 0;
          }

          if(i==1 || i==2 || i==4|| i==6|| i==8|| i==9){
               this.rotateGroup.add(this.shape);
          }else{
               this.myArray.add(this.shape);      

          }


     }
     console.log(this.rotateGroup);
     this.movingCube = this.rotateGroup.children[2];

     this.pushingCube1 = this.myArray.children[2];
     this.pushingCube2 = this.myArray.children[3];

     this.tl = new TimelineMax({repeat: -1});

     this.tl.to(this.rotateGroup.rotation,0.3,{y:0,ease:Expo.easeOut});
     this.tl.to(this.pushingCube1.position,0.3,{y:2*85,ease:Expo.easeOut});
     this.tl.to(this.movingCube.position,0.3,{y:85,ease:Expo.easeOut},"=-0.3");
     this.tl.to(this.pushingCube1.position,0.3,{y:3*85,ease:Expo.easeOut});
     this.tl.to(this.rotateGroup.rotation,0.5,{y:-Math.PI/2,ease:Expo.easeOut});
     this.tl.to(this.pushingCube2.position,0.3,{y:85,ease:Expo.easeOut});
     this.tl.to(this.movingCube.position,0.3,{y:2*85,ease:Expo.easeOut},"=-0.3");
     this.tl.to(this.pushingCube2.position,0.3,{y:0,ease:Expo.easeOut});
     this.tl.to(this.rotateGroup.rotation,0.3,{y:0,ease:Expo.easeOut});


};

threejs.prototype.render = function render() {
     requestAnimationFrame(this.render.bind(this));
     this.renderer.render(this.scene, this.camera);
};

var shape = new threejs();
shape.init();