function vec2_angle(v1, v2) {
	if (v1[0] === 0 && v1[1] === 0 && v2[0] === 0 && v2[1] === 0) {
		return 0;
	}
	var dot = v1[0] * v2[0] + v1[1] * v2[1];
	var v1mag = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
	var v2mag = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
	var amt = dot / (v1mag * v2mag);
	if (amt <= -1) {
		return Math.PI;
	} else if (amt >= 1) {
		return 0;
	}
	return Math.acos(amt);
}

function vec2_dist(v1, v2) {
	var dx = v1[0] - v2[0];
	var dy = v1[1] - v2[1];
	return Math.sqrt(dx*dx + dy*dy);
}

function vec2_dot(v1, v2) {
	return v1[0]*v2[0] + v1[1]*v2[1];
}

function vec2_from_angle(angle) {
	return [Math.cos(angle), Math.sin(angle)];
}

function vec2_get_mag(v1) {
	return Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1]);
}

function vec2_get_mag_sq(v1) {
	return v1[0]*v1[0] + v1[1]*v1[1];
}

function vec2_heading(v1) {
	return Math.atan2(v1[1], v1[0]);
}

function vec2_limit(v1, max) {
	if (vec2_get_mag_sq(v1) > max * max) {
		vec2_normalize(v1);
		v1[0] *= max;
		v1[1] *= max;
	}
}

function vec2_normalize(v1) {
	var m = vec2_get_mag(v1);
	if (m !== 0 && m !== 1) {
		v1[0] /= m;
		v1[1] /= m;
	}
}

function vec2_rotate(v1, theta) {
	var t = v1[0];
	v1[0] = v1[0] * Math.cos(theta) - v1[1] * Math.sin(theta);
	v1[1] = t * Math.sin(theta) + v1[1] * Math.cos(theta);
}

function vec2_set_mag(v1, len) {
	vec2_normalize(v1);
	v1[0] *= len;
	v1[1] *= len;
}

const vec2 = {
	angle: vec2_angle,
	dist: vec2_dist,
	dot: vec2_dot,
	from_angle: vec2_from_angle,
	get_mag: vec2_get_mag,
	get_mag_sq: vec2_get_mag_sq,
	heading: vec2_heading,
	limit: vec2_limit,
	normalize: vec2_normalize,
	rotate: vec2_rotate,
	set_mag: vec2_set_mag
};

export default vec2;
