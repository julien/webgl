function angle(v1, v2) {
	if (v1[0] === 0 && v1[1] === 0 && v2[0] === 0 && v2[1] === 0) {
		return 0;
	}
	const dot = v1[0] * v2[0] + v1[1] * v2[1];
	const v1mag = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
	const v2mag = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
	const amt = dot / (v1mag * v2mag);
	if (amt <= -1) {
		return Math.PI;
	} else if (amt >= 1) {
		return 0;
	}
	return Math.acos(amt);
}

function dist(v1, v2) {
	const dx = v1[0] - v2[0];
	const dy = v1[1] - v2[1];
	return Math.sqrt(dx * dx + dy * dy);
}

function dot(v1, v2) {
	return v1[0] * v2[0] + v1[1] * v2[1];
}

function fromAngle(angle) {
	return [Math.cos(angle), Math.sin(angle)];
}

function getMag(v1) {
	return Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
}

function getMagSq(v1) {
	return v1[0] * v1[0] + v1[1] * v1[1];
}

function heading(v1) {
	return Math.atan2(v1[1], v1[0]);
}

function limit(v1, max) {
	if (getMagSq(v1) > max * max) {
		normalize(v1);
		v1[0] *= max;
		v1[1] *= max;
	}
}

function normalize(v1) {
	const m = getMag(v1);
	if (m !== 0 && m !== 1) {
		v1[0] /= m;
		v1[1] /= m;
	}
}

function rotate(v1, theta) {
	let t = v1[0];
	v1[0] = v1[0] * Math.cos(theta) - v1[1] * Math.sin(theta);
	v1[1] = t * Math.sin(theta) + v1[1] * Math.cos(theta);
}

function setMag(v1, len) {
	normalize(v1);
	v1[0] *= len;
	v1[1] *= len;
}

const vec2 = {
	angle,
	dist,
	dot,
	fromAngle,
	getMag,
	getMagSq,
	heading,
	limit,
	normalize,
	rotate,
	setMag,
};

export default vec2;
