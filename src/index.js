import Renderer from './renderer.js';
import vec2 from './vec2.js';
import {createTexture} from './gl-utils.js';
import {map, random} from './math-utils.js';

const MAX_FLEE_DISTANCE = 400;
const MIN_FLEE_DISTANCE = 60;
const SPRITE_COUNT = 5000;
const SPRITE_MAX_FORCE = 30;
const SPRITE_MAX_SPEED = 10;
let fleeDistance = MAX_FLEE_DISTANCE * 0.5;
let canvas, img, mouse, renderer, texture;
const sprites = {
	ax: Array.from(new Array(SPRITE_COUNT)).fill(0),
	ay: Array.from(new Array(SPRITE_COUNT)).fill(0),
	count: 0,
	dx: Array.from(new Array(SPRITE_COUNT)).fill(0),
	dy: Array.from(new Array(SPRITE_COUNT)).fill(0),
	hh: Array.from(new Array(SPRITE_COUNT)).fill(0),
	hw: Array.from(new Array(SPRITE_COUNT)).fill(0),
	px: Array.from(new Array(SPRITE_COUNT)).fill(0),
	py: Array.from(new Array(SPRITE_COUNT)).fill(0),
	rgba: Array.from(new Array(SPRITE_COUNT)).fill(0),
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
	const force = [0, 0];

	if (idx < SPRITE_COUNT) {
		const desired = [
			target[0] - sprites.px[idx],
			target[1] - sprites.py[idx]
		];

		let speed = SPRITE_MAX_SPEED;
		const dist = vec2.get_mag(desired);

		if (dist < 100) {
			speed = map(dist, 0, 100, 0, SPRITE_MAX_SPEED);
		}

		vec2.set_mag(desired, speed);

		force[0] = desired[0] - sprites.vx[idx];
		force[1] = desired[1] - sprites.vy[idx];

		vec2.limit(force, SPRITE_MAX_FORCE);
	}

	return force;
}

function spriteFlee(sprites, idx, target) {
	const force = [0, 0];

	if (idx < SPRITE_COUNT) {
		const desired = [
			target[0] - sprites.px[idx],
			target[1] - sprites.py[idx]
		];

		const dist = vec2.get_mag(desired);

		if (dist < fleeDistance) {
			vec2.set_mag(desired, SPRITE_MAX_SPEED);
			desired[0] *= -1;
			desired[1] *= -1;

			force[0] = desired[0] - sprites.vx[idx];
			force[1] = desired[1] - sprites.vy[idx];

			vec2.limit(force, SPRITE_MAX_FORCE);
		}
	}

	return force;
}

function spriteForce(sprites, idx, force) {
	if (idx < SPRITE_COUNT) {
		sprites.ax[idx] += force[0];
		sprites.ay[idx] += force[1];
		sprites.sx[idx] += force[0] * 0.0125;
		sprites.sy[idx] += force[0] * 0.0125;
	}
}

function onMouseDown(e) {
	e.preventDefault();
	e.stopPropagation();
	if (e.button === 0) {
		if (sprites.count + 100 < SPRITE_COUNT) {
			sprites.count += 100;
		}
	}
	if (e.button === 2) {
		if (sprites.count - 100 > 1) {
			sprites.count -= 100;
		}
	}
}

function onMouseWheel(e) {
	if (e.deltaY > 0) {
		if (fleeDistance + 10 < MAX_FLEE_DISTANCE) {
			fleeDistance += 10;
		}
	}
	if (e.deltaY < 0) {
		if (fleeDistance - 10 > MIN_FLEE_DISTANCE) {
			fleeDistance -= 10;
		}
	}
}

function onMouseMove(e) {
	mouse[0] = e.clientX;
	mouse[1] = e.clientY;
}

function onTouchMove(e) {
	mouse[0] = e.touches[0].clientX;
	mouse[1] = e.touches[0].clientY;
}

function spritesInit() {
	const hw = canvas.width * 0.5;
	const hh = canvas.height * 0.5;

	for (let i = 0; i < SPRITE_COUNT; i++) {
		sprites.ax[i] = 0;
		sprites.ay[i] = 0;
		sprites.dx[i] = img.width;
		sprites.dy[i] = img.height;
		sprites.hw[i] = img.width * 0.5;
		sprites.hh[i] = img.height * 0.5;
		sprites.px[i] = hw + random(-hw, hw);
		sprites.py[i] = hh + random(-hh, hh);

		sprites.rgba[i] = Math.random() * 0xFFFFFFFF;

		const size = 1 + random(0.25, 1.5);
		sprites.sx[i] = sprites.sy[i] = size;

		const target = [sprites.px[i], sprites.py[i]];
		sprites.target[i] = target;

		sprites.u0[i] = 0;
		sprites.u1[i] = 0;
		sprites.v0[i] = 1;
		sprites.v1[i] = 1;

		sprites.vx[i] = random(-2, 2);
		sprites.vy[i] = random(-2, 2);
	}

	sprites.count = 2000;

	requestAnimationFrame(loop);
}

function update() {
	for (let i = 0; i < sprites.count; i++) {
		sprites.px[i] += sprites.vx[i];
		sprites.py[i] += sprites.vy[i];

		sprites.vx[i] += sprites.ax[i];
		sprites.vy[i] += sprites.ay[i];

		sprites.ax[i] = 0;
		sprites.ay[i] = 0;

		const a = spriteArrive(sprites, i, sprites.target[i]);
		a[0] *= 0.75;
		a[1] *= 0.75;

		const f = spriteFlee(sprites, i, mouse);
		f[1] *= 0.75;
		f[1] *= 0.75;

		spriteForce(sprites, i, a);
		spriteForce(sprites, i, f);
	}
}

function draw() {
	renderer.cls();
	for (let i = 0; i < sprites.count; i++) {
		renderer.col = sprites.rgba[i];
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

onload = function() {
	canvas = document.getElementById('c');
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	renderer = new Renderer(canvas);
	renderer.bkg(0.0, 0.0, 0.0);

	img = new Image();
	img.onload = function() {
		texture = createTexture(renderer.gl, img);
		spritesInit();
	};
	img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAnUlEQVRYR+2XsQ6AIAxEYVD//3PVQcNAYhTKnSlphzKb3uOBUHIyHtk4PwUAbWA/j0tatm1ZqZrwx6PgNxQKAgGw4RUGgRAB/gYzNvwCaM1+tBxNA9rhEoQ/gFmz71n4GAiAMBAGzA2U/3UWROt29HcS1hNL20KvN/B7HWvuBakz8t2SPVsrdk8g/WCpDxlgQNDgWpMG0H7KBYC5gRtfzGAhGEQe7AAAAABJRU5ErkJgggAA';

	mouse = [canvas.width * 0.5, canvas.height * 0.5];

	document.body.addEventListener('mousemove', onMouseMove, false);
	document.body.addEventListener('touchmove', onTouchMove, false);
	document.addEventListener('mousedown', onMouseDown, false);
	document.addEventListener('mousewheel', onMouseWheel, false);
	canvas.addEventListener('contextmenu', e => e.preventDefault());
};

