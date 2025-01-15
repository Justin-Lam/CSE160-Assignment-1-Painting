const VSHADER_SOURCE = `
	void main() {
		gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
		gl_PointSize = 10.0;
	}`;

const FSHADER_SOURCE = `
	void main() {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}`;

function main() {
	const canvas = document.getElementById('webgl');

	const gl = getWebGLContext(canvas);
	if (!gl) {
		throw new Error("Failed to get the rendering context for WebGL");
		return;
	}

	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw new Error("Failed to intialize shaders");
		return;
	}

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Draw a point
	gl.drawArrays(gl.POINTS, 0, 1);
}