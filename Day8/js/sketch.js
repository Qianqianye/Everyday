            var VELOCITY = 2;
            var PARTICLES = 300;
            
            var mouse = {x:0, y:0};
            var particles = []; 
            var colors = [ "#f9cbcb","#f8ffe5","#caeadc","#baab8c","#765d5d" ];   //Shades of Icecream

            function pressButton(buttonName){

                if ('icecream'.indexOf(buttonName) != -1 ) {
                    colors = [ "#f9cbcb","#f8ffe5","#caeadc","#baab8c","#765d5d" ];   //Shades of Icecream
                    console.log('lets eat icecream');
                }
                else if('calm'.indexOf(buttonName) != -1 ) {
                    colors = [ "#7465b4","#4b5289","#504d72","#716c83","#8e8ca5" ];   //Shades of Sadness
                    console.log('calm now');
                }
                else if('active'.indexOf(buttonName) != -1 ) {
                    colors = [ "#b3ecec","#89ecda","#43e8d8","#40e0d0","#3bd6c6" ];  //Shades of Turquoise
                    console.log('active time!');
                }
                else if('party'.indexOf(buttonName) != -1 ) {
                    colors = [ "#e39bf3","#d767cf","#9968d1","#6138bb","#0990b3" ];   //Shades of Neon
                console.log('PARTY time!!!');
                }else{
                    console.log('that button is not programmed yet');
                }

                for( var i = 0; i < PARTICLES; i++ ) {
                    particles[i].color = colors[ Math.floor( Math.random() * colors.length ) ];             
                }
            }

            var canvas = document.getElementById('projector');
            var context;
            
            if (canvas && canvas.getContext) {
                context = canvas.getContext('2d');
                
                for( var i = 0; i < PARTICLES; i++ ) {
                        particles.push( { 
                        x: Math.random()*window.innerWidth, 
                        y: Math.random()*window.innerHeight, 
                        vx: ((Math.random()*(VELOCITY*2))-VELOCITY),
                        vy: ((Math.random()*(VELOCITY*2))-VELOCITY),
                        size: 1+Math.random()*3,
                        color: colors[ Math.floor( Math.random() * colors.length ) ] 
                    } );
                }
                
                Initialize();
            }
            
            function Initialize() {
                canvas.addEventListener('mousemove', MouseMove, false);
                window.addEventListener('mousedown', MouseDown, false);
                window.addEventListener('resize', ResizeCanvas, false);
                setInterval( TimeUpdate, 40 );
                
                ResizeCanvas();
            }
            
            function TimeUpdate(e) {
                
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                
                var len = particles.length;
                var particle;
                
                for( var i = 0; i < len; i++ ) {
                    particle = particles[i];
                    
                    if (!particle.frozen) {
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        
                        if (particle.x > window.innerWidth) {
                            particle.vx = -VELOCITY - Math.random();
                        }
                        else if (particle.x < 0) {
                            particle.vx = VELOCITY + Math.random();
                        }
                        else {
                            particle.vx *= 1 + (Math.random() * 0.005);
                        }
                        
                        if (particle.y > window.innerHeight) {
                            particle.vy = -VELOCITY - Math.random();
                        }
                        else if (particle.y < 0) {
                            particle.vy = VELOCITY + Math.random();
                        }
                        else {
                            particle.vy *= 1 + (Math.random() * 0.005);
                        }
                        
                        var distanceFactor = DistanceBetween( mouse, particle );
                        distanceFactor = Math.max( Math.min( 15 - ( distanceFactor / 10 ), 10 ), 1 );
                        
                        particle.currentSize = particle.size*distanceFactor;
                    }
                    
                    context.fillStyle = particle.color; ///------------------------!color------------------------//////
                    context.beginPath();
                    context.arc(particle.x,particle.y,particle.currentSize,0,Math.PI*2,true);
                    context.closePath();
                    context.fill();
                    
                }
            }
            
            function MouseMove(e) {
                mouse.x = e.layerX;
                mouse.y = e.layerY;
            }
            
            function MouseDown(e) {
                var len = particles.length;
                
                var closestIndex = 0;
                var closestDistance = 1000;
                
                for( var i = 0; i < len; i++ ) {
                    var thisDistance = DistanceBetween( particles[i], mouse );
                    
                    if( thisDistance < closestDistance ) {
                        closestDistance = thisDistance;
                        closestIndex = i;
                    }
                    
                }
                
                if (closestDistance < particles[closestIndex].currentSize) {
                    particles[closestIndex].frozen = true;
                }
            }
            
            function ResizeCanvas(e) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            
            function DistanceBetween(p1,p2) {
                var dx = p2.x-p1.x;
                var dy = p2.y-p1.y;
                return Math.sqrt(dx*dx + dy*dy);
            }
