function HSLA(h, s, l, a)
{
  this.h = h;
  this.s = s;
  this.l = l;
  this.a = a === 0 ? 0 : (a ? a : 1);
}

HSLA.prototype = {
  clone : function()
  {
    return new HSLA(this.h, this.s, this.l, this.a);
  },

  toString : function()
  {
    var h = Math.round(this.h);
    var s = Math.round(this.s);
    var l = Math.round(this.l);
    return "hsla(" + h + ", " + s + "%, " + l + "%, " + this.a + ")";
  }
}

var width = window.innerWidth;
var height = window.innerHeight;

var canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);

var ctx = canvas.getContext("2d");

var framerate = 1000 / 60;

function Node ()
{
  this.x = this.y = 0;
  this.vx = this.vy = 0;

  this.top = null;
  this.bottom = null;
  this.left = null;
  this.right = null;
}

var color = new HSLA(0, 0, 0);

var friction = 0.999;
var ranVel = 1.8;
var nx = ny = 15;
var constraintLength = 15;
var constraintForce = 0.8;

var boundaryForce = 0.07;

var dx = 0.5 * (width - (nx * constraintLength)) 
var dy = 0.5 * (height - (nx * constraintLength)) 

function Cloud()
{
  this.nodes = [];
  for(var j = 0; j < ny; j++)
  {
    for(var i = 0; i < nx; i++)
    {
      var node = new Node();
      node.x = i * constraintLength + dx;
      node.y = j * constraintLength + dy;
      var id = this.nodes.length;
      if(i > 0)
      {
        node.left = this.nodes[id - 1];
        node.left.right = node;
      }
      if(j > 0)
      {
        node.top = this.nodes[id - nx];
        node.top.bottom = node;
      }

      node.vx += 0.1 * (Math.random() * 2 - 1);
      node.vy += 0.1 * (Math.random() * 2 - 1);
      node.color = color.clone();
      node.color.l += Math.random() * (100 - color.l);
      node.color.a = 0.5;

      this.nodes[id] = node;
    }
  }

}

Cloud.prototype = {

  update : function ()
  {
    var n = this.nodes.length;
    for(var i = 0; i < n; i++)
    {
      var node = this.nodes[i];
      if(node.bottom) this.applyConstraint(node, node.bottom);
      if(node.right) this.applyConstraint(node, node.right);
      node.vx += ranVel * (Math.random() * 2 - 1);
      node.vy += ranVel * (Math.random() * 2 - 1);
      node.vx *= friction;
      node.vy *= friction;
      node.x += node.vx;
      node.y += node.vy;

      if(node.x < 0)
        node.vx += boundaryForce;
      else if(node.x > width)
        node.vx -= boundaryForce;
      if(node.y < 0)
        node.vy += boundaryForce;
      else if(node.y > height)
        node.vy -= boundaryForce;
    }
  },

  applyConstraint : function (a, b)
  {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var delta = constraintLength - dist;
    var ratio = 0.5 * delta / dist;
    a.x -= constraintForce * dx * ratio;
    a.y -= constraintForce * dy * ratio;
    b.x += constraintForce * dx * ratio;
    b.y += constraintForce * dy * ratio;
  },

  draw : function ()
  {
    var n = this.nodes.length;
    for(var i = 0; i < n; i++)
    {
      var node = this.nodes[i];
      if(node.top && node.left)
      {
        ctx.fillStyle = node.color.toString();
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.left.x, node.left.y);
        ctx.lineTo(node.left.top.x, node.left.top.y);
        ctx.lineTo(node.top.x, node.top.y);
        ctx.lineTo(node.x, node.y);
        ctx.fill();
      }
    }
  }
}

var cloud1 = new Cloud();
var cloud2 = new Cloud();
var cloud3 = new Cloud();
var cloud4 = new Cloud();

function update()
{
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color.toString();
  ctx.fillRect(0, 0, width, height);
  cloud1.update();
  cloud2.update();
  cloud3.update();
  cloud4.update();
  cloud1.draw();
  cloud2.draw();
  cloud3.draw();
  cloud4.draw();
  setTimeout(update.bind(this), framerate);
}


update();