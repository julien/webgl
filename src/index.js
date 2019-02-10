'use strict';
var Renderer = require('./renderer');
var Vec2 = require('./vec2');
var lib = require('./lib');

var SPRITE_COUNT = 100;
var canvas;
var renderer;
var img;
var mouse;
var tex;
var texWidth, texHeight;
var particles = {
  ax: new Array(SPRITE_COUNT).fill(0),
  ay: new Array(SPRITE_COUNT).fill(0),
  cr: new Array(SPRITE_COUNT).fill(0),
  cg: new Array(SPRITE_COUNT).fill(0),
  cb: new Array(SPRITE_COUNT).fill(0),
  px: new Array(SPRITE_COUNT).fill(0),
  py: new Array(SPRITE_COUNT).fill(0),
  sx: new Array(SPRITE_COUNT).fill(0),
  sy: new Array(SPRITE_COUNT).fill(0),
  vx: new Array(SPRITE_COUNT).fill(0),
  vy: new Array(SPRITE_COUNT).fill(0),
  life: new Array(SPRITE_COUNT).fill(0),
  count: SPRITE_COUNT
};


onload = () => {
  canvas = document.getElementById('c');
  renderer = new Renderer(canvas);

  img = new Image();
  img.onload = () => {
    tex = lib.createTexture(renderer.gl, img);
    texWidth = img.width;
    texHeight = img.height;
    init();
  };
  img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAnUlEQVRYR+2XsQ6AIAxEYVD//3PVQcNAYhTKnSlphzKb3uOBUHIyHtk4PwUAbWA/j0tatm1ZqZrwx6PgNxQKAgGw4RUGgRAB/gYzNvwCaM1+tBxNA9rhEoQ/gFmz71n4GAiAMBAGzA2U/3UWROt29HcS1hNL20KvN/B7HWvuBakz8t2SPVsrdk8g/WCpDxlgQNDgWpMG0H7KBYC5gRtfzGAhGEQe7AAAAABJRU5ErkJgggAA';

  mouse = new Vec2(innerWidth * 0.5, innerHeight * 0.5);
};

function init() {

}

function update() {

}
