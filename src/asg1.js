const VSHADER_SOURCE = `
	attribute vec4 a_Position;
	void main() {
		gl_Position = a_Position;
		gl_PointSize = 10.0;
	}`;

const FSHADER_SOURCE = `
	precision mediump float;
	uniform vec4 u_FragColor;
	void main() {
		gl_FragColor = u_FragColor;
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

	const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		throw new Error("Failed to get the storage location of a_Position");
		return;
	}
	const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
		throw new Error("Failed to get the storage location of u_FragColor");
		return;
	}

	canvas.onmousedown = function(e){ click(e, gl, canvas, a_Position, u_FragColor) };

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

const g_points = [];	// The array for the position of a mouse press
const g_colors = [];	// The array to store the color of a point
function click(e, gl, canvas, a_Position, u_FragColor) {
	let x = e.clientX;	// x coordinate of a mouse pointer
	let y = e.clientY;	// y coordinate of a mouse pointer
	let rect = e.target.getBoundingClientRect();

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

	// Store the coordinates to g_points array
		g_points.push([x, y]);
	// Store the coordinates to g_points array
	if (x >= 0.0 && y >= 0.0) {      // First quadrant
		g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
	} else if (x < 0.0 && y < 0.0) { // Third quadrant
		g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
	} else {                         // Others
		g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
	}

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	const len = g_points.length;
	for(let i = 0; i < len; i++) {
		const xy = g_points[i];
		const rgba = g_colors[i];

		// Pass the position of a point to a_Position variable
		gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
		// Pass the color of a point to u_FragColor variable
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		// Draw
		gl.drawArrays(gl.POINTS, 0, 1);
	}
}
