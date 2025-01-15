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

let canvas;
let gl;
let a_Position;
let u_FragColor;

// Set up the canvas and gl variables
function setupWebGL() {
	canvas = document.getElementById('webgl');
	gl = getWebGLContext(canvas);
	if (!gl) {
		throw new Error("Failed to get the rendering context for WebGL");
		return;
	}
}

// Set up GLSL shader programs and connect GLSL variables
function connectVariablesToGLSL() {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw new Error("Failed to intialize shaders");
		return;
	}

	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		throw new Error("Failed to get the storage location of a_Position");
		return;
	}

	u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
		throw new Error("Failed to get the storage location of u_FragColor");
		return;
	}
}

function main() {
	setupWebGL();
	connectVariablesToGLSL();
	canvas.onmousedown = click;
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

const g_points = [];	// The array for the position of a mouse press
const g_colors = [];	// The array to store the color of a point
function click(e) {
	const [x, y] = convertCoordinatesEventToGL(e);

	// Store the coordinates to g_points array
	g_points.push([x, y]);
	// Store the coordinates to g_colors array
	if (x >= 0.0 && y >= 0.0) {      // First quadrant
		g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
	} else if (x < 0.0 && y < 0.0) { // Third quadrant
		g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
	} else {                         // Others
		g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
	}

	renderAllShapes();
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(e) {
	let x = e.clientX;
	let y = e.clientY;
	const rect = e.target.getBoundingClientRect();
	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
	return [x, y];
}

// Draw every shape that's supposed to be in the canvas
function renderAllShapes() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	for(let i = 0; i < g_points.length; i++) {
		const xy = g_points[i];
		const rgba = g_colors[i];
		gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.drawArrays(gl.POINTS, 0, 1);
	}
}
