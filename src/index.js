'use strict';
var Renderer = require('./renderer');
var Vec2 = require('./vec2');

var SPRITE_COUNT = 100;

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
var canvas = document.getElementById('c');

var mouse = new Vec2();
