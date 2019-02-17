'use strict';

function Vec2(x, y) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
}

Vec2.prototype.add = function (v2) {
  this.x += v2.x;
  this.y += v2.y;
};

Vec2.prototype.angle = function (v2) {
  if (this.x === 0 && this.y === 0 && v2.x === 0 && v2.y === 0) {
    return 0;
  }
  var dot = this.x * v2.x + this.y * v2.y;
  var v1mag = Math.sqrt(this.x * this.x + this.y * this.y);
  var v2mag = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  var amt = dot / (v1mag * v2mag);
  if (amt <= -1) {
    return Math.PI;
  } else if (amt >= 1) {
    return 0;
  }
  return Math.acos(amt);
};

Vec2.prototype.dist = function (v2) {
  var dx = this.x - v2.x;
  var dy = this.y - v2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

Vec2.prototype.div = function (value) {
  this.x /= value;
  this.y /= value;
};

Vec2.prototype.dot = function (v2) {
  return this.x * v2.x + this.y * v2.y;
};

Vec2.prototype.fromAngle = function (angle) {
  return new Vec2(Math.cos(angle), Math.sin(angle));
};

Vec2.prototype.getMag = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vec2.prototype.getMagSq = function () {
  return this.x * this.x + this.y * this.y;
};

Vec2.prototype.heading = function () {
  return Math.atan2(this.y, this.x); // not sure if this should not be inverted
};

Vec2.prototype.mul = function (value) {
  this.x *= value;
  this.y *= value;
};

Vec2.prototype.normalize = function () {
  var m = this.getMag();
  if (m !== 0 && m !== 1) {
    this.x /= m;
    this.y /= m;
  }
};

Vec2.prototype.limit = function (max) {
  if (this.getMagSq() > max * max) {
    this.normalize();
    this.x *= max;
    this.y *= max;
  }
};

Vec2.prototype.rotate = function (theta) {
  var t = this.x;
  this.x = this.x * Math.cos(theta) - this.y * Math.sin(theta);
  this.y = t * Math.sin(theta) + this.y * Math.cos(theta);
};

Vec2.prototype.setMag = function (len) {
  this.normalize();
  this.x *= len;
  this.y *= len;
};

Vec2.prototype.sub = function (v2) {
  this.x -= v2.x;
  this.y -= v2.y;
};

module.exports = Vec2;

