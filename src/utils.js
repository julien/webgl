export function createBuffer(gl, target, size, usage) {
	const buf = gl.createBuffer();
	gl.bindBuffer(target, buf);
	gl.bufferData(target, size, usage);
	return buf;
}

export function createProgram(gl, vert, frag) {
	const vs = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vs, vert);
	gl.compileShader(vs);

	const fs = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fs, frag);
	gl.compileShader(fs);

	const prog = gl.createProgram();
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);

	return prog;
}

export function createTexture(gl, image) {
	const tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.bindTexture(gl.TEXTURE_2D, null);
	return tex;
}

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
