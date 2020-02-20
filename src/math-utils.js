export function lerp(norm, min, max) {
	return (max - min) * norm + min;
}

export function norm(value, min, max) {
	return (value - min) / (max - min);
}

export function map(value, sourceMin, sourceMax, destMin, destMax) {
	return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
}

export function random(min, max) {
	return min + Math.random() * (max - min);
}

