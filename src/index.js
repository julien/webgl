'use strict';
var Renderer = require('./renderer');
var Vec2 = require('./vec2');
var lib = require('./lib');

function Sprite(texture, width, height) {
  this.accX = 0;
  this.accX = 0;

  this.colR = 0;
  this.colG = 0;
  this.colB = 0;

  this.posX = 0;
  this.posY = 0;

  this.scaleX = 1;
  this.scaleY = 1;

  this.velX = 0;
  this.velY = 0;

  this.life = 0;

  this.tex = texture;
  this.texW = width;
  this.texH = height;

  this.halfW = this.texW / 2;
  this.halfH = this.texH / 2;

  this.u0 = 0;
  this.u1 = 0;
  this.v0 = this.texW;
  this.v1 = this.texH;

  this.target = null;
}

Sprite.prototype.applyForce = function(force) {
  this.accX += force.x;
  this.accY += force.y;
};

Sprite.prototype.flee = function(target) {
  var force = new Vec2();
  var desired = new Vec2(
    target.x - this.posX,
    target.y - this.posY
  );

  var dist = desired.get_mag();

  if (dist < fleeDistance) {
    desired.set_mag(SPRITE_MAX_SPEED);
    desired.x *= -1;
    desired.y *= -1;

    force.x = desired.x - this.velX;
    force.y = desired.y - this.velY;

    force.limit(SPRITE_MAX_FORCE);
  }

  return force;
};

Sprite.prototype.arrive = function(target) {
  var force = new Vec2();

  var desired = new Vec2(
    target.x - this.posX,
    target.y - this.posY
  );

  var speed = SPRITE_MAX_SPEED;
  var dist = desired.get_mag();
  if (dist < 100) {
    speed = map(dist, 0, 100, 0, SPRITE_MAX_SPEED);
  }
  desired.set_mag(speed);

  force.x = desired.x - this.velX;
  force.y = desired.y - this.velY;

  force.limit(SPRITE_MAX_FORCE);

  return force;
};

function randRange(min, max) {
	return min + Math.random() * (max - min);
}

function norm(value, min, max) {
  return (value - min) / (max - min);
}

function lerp(norm, min, max) {
  return (max - min) * norm + min;
}

function map(value, sourceMin, sourceMax, destMin, destMax) {
  return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
}

var SPRITE_COUNT = 500;
var SPRITE_MAX_FORCE = 10;
var SPRITE_MAX_SPEED = 80;
var MIN_FLEE_DISTANCE = 80;
var MAX_FLEE_DISTANCE = 120;
var canvas;
var renderer;
var img;
var mouse;
var texture;
var sprites = [];
var fleeDistance = MIN_FLEE_DISTANCE;

onload = () => {
  canvas = document.getElementById('c');
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  renderer = new Renderer(canvas);
  renderer.bkg(0.0, 0.0, 0.0);

  img = new Image();
  img.onload = () => {
    texture = lib.createTexture(renderer.gl, img);
    initSprites();
  };
  img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAnUlEQVRYR+2XsQ6AIAxEYVD//3PVQcNAYhTKnSlphzKb3uOBUHIyHtk4PwUAbWA/j0tatm1ZqZrwx6PgNxQKAgGw4RUGgRAB/gYzNvwCaM1+tBxNA9rhEoQ/gFmz71n4GAiAMBAGzA2U/3UWROt29HcS1hNL20KvN/B7HWvuBakz8t2SPVsrdk8g/WCpDxlgQNDgWpMG0H7KBYC5gRtfzGAhGEQe7AAAAABJRU5ErkJgggAA';

  mouse = new Vec2(innerWidth * 0.5, innerHeight * 0.5);
  document.body.addEventListener('mousemove', onMouseMove);
};

function onMouseMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function initSprites() {
  var hw = innerWidth * 0.5;
  var hh = innerHeight * 0.5;

  for (var i = 0; i < SPRITE_COUNT; i++) {
    var s = new Sprite(texture, img.width, img.height);
    s.accX = 0;
    s.accY = 0;

    s.posX = hw + randRange(0, hw);
    s.posY = hh + randRange(0, hh);

    s.velX = 0;
    s.velY = 0;

    var target = new Vec2(s.posX, s.posY);
    s.target = target;

    s.colR = randRange(1, 10) * 0.1;
    s.colG = randRange(1, 10) * 0.1;
    s.colB = randRange(1, 10) * 0.1;

    var size = 10 + randRange(0, 20);
    s.scaleX = s.scaleY = size;

    sprites.push(s);
  }

  requestAnimationFrame(loop);
}

function updateSprites() {
  for (var i = 0; i < SPRITE_COUNT; i++) {
    var s = sprites[i];
    s.posX += s.velX;
    s.posY += s.velY;

    s.velX += s.accX;
    s.velY += s.accY;

    s.accX = 0;
    s.accY = 0;
  }
}

function applyBehaviours() {
  for (var i = 0; i < SPRITE_COUNT; i++) {
    var s = sprites[i];

    var arrive = s.arrive(s.target);
    arrive.x *= 0.3;
    arrive.y *= 0.3;

    var flee = s.flee(mouse);
    flee.x *= 0.75;
    flee.y *= 0.75;

    s.applyForce(arrive);
    s.applyForce(flee);
  }
}

function update() {
  updateSprites()
  applyBehaviours()
}

function draw() {
  renderer.cls();
  for (var i = 0; i < SPRITE_COUNT; i++) {
    var s = sprites[i];
    renderer.img(
      s.tex,
     -s.halfW,
     -s.halfH,
      s.texW,
      s.texH,
      0,
      s.posX,
      s.posY,
      s.scaleX,
      s.scaleY,
      s.u0,
      s.u1,
      s.v0,
      s.v1
    );
  }
  renderer.flush();
}

function loop(deltaTime) {
  requestAnimationFrame(loop);
  update();
  draw();
}


