'use strict';
var Renderer = require('./renderer');
var Vec2 = require('./vec2');
var lib = require('./gl-utils');
var math = require('./math-utils');

var MAX_FLEE_DISTANCE = 400;
var MIN_FLEE_DISTANCE = 60;
var SPRITE_COUNT = 1000;
var SPRITE_MAX_FORCE = 30;
var SPRITE_MAX_SPEED = 10;
var fleeDistance = MAX_FLEE_DISTANCE * 0.5;
var canvas, img, mouse, renderer, texture;
var sprites = {
  ax: Array.from(new Array(SPRITE_COUNT)).fill(0),
  ay: Array.from(new Array(SPRITE_COUNT)).fill(0),
  count: 0,
  dx: Array.from(new Array(SPRITE_COUNT)).fill(0),
  dy: Array.from(new Array(SPRITE_COUNT)).fill(0),
  hh: Array.from(new Array(SPRITE_COUNT)).fill(0),
  hw: Array.from(new Array(SPRITE_COUNT)).fill(0),
  px: Array.from(new Array(SPRITE_COUNT)).fill(0),
  py: Array.from(new Array(SPRITE_COUNT)).fill(0),
  sx: Array.from(new Array(SPRITE_COUNT)).fill(0),
  sy: Array.from(new Array(SPRITE_COUNT)).fill(0),
  target: Array.from(new Array(SPRITE_COUNT)).fill(0),
  u0: Array.from(new Array(SPRITE_COUNT)).fill(0),
  u1: Array.from(new Array(SPRITE_COUNT)).fill(0),
  v0: Array.from(new Array(SPRITE_COUNT)).fill(0),
  v1: Array.from(new Array(SPRITE_COUNT)).fill(0),
  vx: Array.from(new Array(SPRITE_COUNT)).fill(0),
  vy: Array.from(new Array(SPRITE_COUNT)).fill(0)
};

function spriteArrive(sprites, idx, target) {
  var force = new Vec2();

  if (idx < SPRITE_COUNT) {
    var desired = new Vec2(
      target.x - sprites.px[idx],
      target.y - sprites.py[idx]
    );

    var speed = SPRITE_MAX_SPEED;
    var dist = desired.getMag();

    if (dist < 100) {
      speed = math.map(dist, 0, 100, 0, SPRITE_MAX_SPEED);
    }

    desired.set_mag(speed);

    force.x = desired.x - sprites.vx[idx];
    force.y = desired.y - sprites.vy[idx];

    force.limit(SPRITE_MAX_FORCE);
  }

  return force;
}

function spriteFlee(sprites, idx, target) {
  var force = new Vec2();

  if (idx < SPRITE_COUNT) {
    var desired = new Vec2(
      target.x - sprites.px[idx],
      target.y - sprites.py[idx]
    );

    var dist = desired.getMag();

    if (dist < fleeDistance) {
      desired.set_mag(SPRITE_MAX_SPEED);
      desired.x *= -1;
      desired.y *= -1;

      force.x = desired.x - sprites.vx[idx];
      force.y = desired.y - sprites.vy[idx];

      force.limit(SPRITE_MAX_FORCE);
    }
  }

  return force;
}

function spriteForce(sprites, idx, force) {
  if (idx < SPRITE_COUNT) {
    sprites.ax[idx] += force.x;
    sprites.ay[idx] += force.y;
  }
}

function onKeyDown(e) {
  if (e.keyCode === 38) {
    if (sprites.count + 100 < SPRITE_COUNT) {
      sprites.count += 100;
    }
  }
  if (e.keyCode === 40) {
    if (sprites.count - 100 > 1) {
      sprites.count -= 100;
    }
  }
  if (e.keyCode === 39) {
    if (fleeDistance + 10 < MAX_FLEE_DISTANCE) {
      fleeDistance += 10;
    }
  }
  if (e.keyCode === 37) {
    if (fleeDistance - 10 > MIN_FLEE_DISTANCE) {
      fleeDistance -= 10;
    }
  }
}

function onMouseMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function onTouchMove(e) {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}

function spritesInit() {
  var hw = canvas.width * 0.5;
  var hh = canvas.height * 0.5;

  for (var i = 0; i < SPRITE_COUNT; i++) {
    sprites.ax[i] = 0;
    sprites.ay[i] = 0;
    sprites.dx[i] = img.width;
    sprites.dy[i] = img.height;
    sprites.hw[i] = img.width * 0.5;
    sprites.hh[i] = img.height * 0.5;
    sprites.px[i] = hw + math.random(-hw, hw);
    sprites.py[i] = hh + math.random(-hh, hh);

    var size = 1 + math.random(0, 1);
    sprites.sx[i] = sprites.sy[i] = size;

    var target = new Vec2(sprites.px[i], sprites.py[i]);
    sprites.target[i] = target;

    sprites.u0[i] = 0;
    sprites.u1[i] = 0;
    sprites.v0[i] = 1;
    sprites.v1[i] = 1;

    sprites.vx[i] = math.random(-2, 2);
    sprites.vy[i] = math.random(-2, 2);
  }

  sprites.count = 400;

  requestAnimationFrame(loop);
}

function update() {
  for (var i = 0; i < sprites.count; i++) {
    sprites.px[i] += sprites.vx[i];
    sprites.py[i] += sprites.vy[i];

    sprites.vx[i] += sprites.ax[i];
    sprites.vy[i] += sprites.ay[i];

    sprites.ax[i] = 0;
    sprites.ay[i] = 0;

    var a = spriteArrive(sprites, i, sprites.target[i]);
    a.x *= 0.3;
    a.y *= 0.3;

    var f = spriteFlee(sprites, i, mouse);
    f.x *= 0.75;
    f.y *= 0.75;

    spriteForce(sprites, i, a);
    spriteForce(sprites, i, f);
  }
}

function draw() {
  renderer.cls();
  for (var i = 0; i < sprites.count; i++) {
    renderer.img(texture,
      -sprites.hw[i], -sprites.hh[i],
      sprites.dx[i], sprites.dy[i], 0,
      sprites.px[i], sprites.py[i],
      sprites.sx[i], sprites.sy[i],
      sprites.u0[i], sprites.u1[i],
      sprites.v0[i], sprites.v1[i]);
  }
  renderer.flush();
}

function loop() {
  requestAnimationFrame(loop);
  update();
  draw();
}

onload = () => {
  canvas = document.getElementById('c');
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  renderer = new Renderer(canvas);
  renderer.bkg(0.0, 0.0, 0.0);

  img = new Image();
  img.onload = () => {
    texture = lib.createTexture(renderer.gl, img);
    spritesInit();
  };
  img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAnUlEQVRYR+2XsQ6AIAxEYVD//3PVQcNAYhTKnSlphzKb3uOBUHIyHtk4PwUAbWA/j0tatm1ZqZrwx6PgNxQKAgGw4RUGgRAB/gYzNvwCaM1+tBxNA9rhEoQ/gFmz71n4GAiAMBAGzA2U/3UWROt29HcS1hNL20KvN/B7HWvuBakz8t2SPVsrdk8g/WCpDxlgQNDgWpMG0H7KBYC5gRtfzGAhGEQe7AAAAABJRU5ErkJgggAA';

  mouse = new Vec2(canvas.width * 0.5, canvas.height * 0.5);

  document.body.addEventListener('mousemove', onMouseMove, false);
  document.body.addEventListener('touchmove', onTouchMove, false);
  document.body.addEventListener('keydown', onKeyDown, false);
};

