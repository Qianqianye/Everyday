	var audio = new Audio ('mio-mix-baby-bass.mp3')

    var width = window.innerWidth;
    var height = window.innerHeight;

    var nodes = [];
    var nodeSize = 3;
    var nodeCount = 300;

    var circleCount = 15;
    var circleOffset = 50;

    var backgroundColor, linkColor, textColor;

    var nodesVisible = true;
    var linksVisible = true;
    var usingColor = true;

    var TWO_PI = Math.PI * 2;

    var CircularNode = function(s, r, color) {
        this.x = 0;
        this.y = 0;
        this.size = s;
        this.radius = r;
        this.angle = random(TWO_PI);
        this.color = color;
        this.angleTween = null;
        this.radiusTween = null;

        this.update = function() {
            this.x = Math.cos(this.angle) * this.radius;
            this.y = Math.sin(this.angle) * this.radius;
        }

        this.draw = function() {
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, TWO_PI);
            context.fillStyle = this.color;
            context.fill();
        }
        return this;
    };

    setup();
    draw();

    function setup() {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        document.body.appendChild(canvas)

        context = canvas.getContext('2d');
        context.lineWidth = .25;

        backgroundColor = 'black';
        textColor = 'black';
        linkColor = 'black';

        setupNodes();
 
        document.getElementById('nodes').onclick = function() {
            nodesVisible = !nodesVisible;
        };

        document.getElementById('links').onclick = function() {
            linksVisible = !linksVisible;
        };

        document.getElementById('colors').onclick = function() {
            usingColor = !usingColor;

            for (var i = 0; i < nodes.length; i++)
                nodes[i].color = (usingColor) ? randomColor() : randomBW();
        };

        flag = false;

        document.onmousedown = function(e) {
            flag = true;
            MOTION.pauseAll();
            audio.play();

     //        if (audio.paused)
    	// 	audio.play();
  			// else
    	// 	audio.pause();
// sample.play();

}

        document.onmousemove = function(e) {
            if (flag) {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].angleTween.seek(e.clientX / width);
                    nodes[i].radiusTween.seek(e.clientY / height);
                }
            }
        }

        document.onmouseup = function(e) {
            flag = false;
            MOTION.resumeAll();
            // audio.pause();
        }
    }



    function setupNodes() {
        nodes = [];

        for (var i = 0; i < nodeCount; i++) {
            var n = new CircularNode(nodeSize, roundRandom(2, circleCount) * circleOffset, (usingColor) ? randomColor() : randomBW());

            var duration1 = roundRandom(15000, 30000);
            var endAngle = n.angle + (roundRandom(100) % 2 == 0 ? -TWO_PI : TWO_PI);

            n.angleTween = new MOTION.Tween(n, 'angle', endAngle, duration1).repeat().play();

            var duration2 = roundRandom(5000, 7500);
            var endRadius = roundRandom(1, circleCount) * circleOffset

            n.radiusTween = new MOTION.Tween(n, 'radius', endRadius, duration2, 0, MOTION.Quad.InOut).repeat().reverse().play()

            nodes.push(n)
        }
    }

    function draw(time) {
        requestAnimationFrame(draw);
        MOTION.update(time);

        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);

        context.save();
        context.translate(width / 2, height / 2);

        for (var i = 0; i < nodes.length; i++) {
            nodes[i].update()
            if (nodesVisible) nodes[i].draw();
        }

        if (linksVisible)
            for (var i = 0; i < nodes.length; i++)
                for (var j = 0; j < nodes.length; j++) {
                    var dx = nodes[j].x - nodes[i].x
                    var dy = nodes[j].y - nodes[i].y

                    if (dx * dx + dy * dy < circleOffset * circleOffset * 2) {
                        context.beginPath();
                        context.moveTo(nodes[i].x, nodes[i].y);
                        context.lineTo(nodes[j].x, nodes[j].y);

                        var linkColor = context.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                        linkColor.addColorStop(0, nodes[i].color);
                        linkColor.addColorStop(1, nodes[j].color);

                        context.strokeStyle = linkColor;
                        context.stroke();
                    }
                }
        context.restore();
    }

