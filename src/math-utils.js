'use strict';

function lerp(norm, min, max) {
  return (max - min) * norm + min;
}

function norm(value, min, max) {
  return (value - min) / (max - min);
}

function map(value, sourceMin, sourceMax, destMin, destMax) {
  return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

exports.lerp = lerp;
exports.map = map;
exports.norm = norm;
exports.random = random;
