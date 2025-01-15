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

function getCanvasAndContext() {
	canvas = document.getElementById('webgl');
	gl = getWebGLContext(canvas);
	if (!gl) {
		throw new Error("Failed to get the rendering context for WebGL");
		return;
	}
}

function compileShadersAndConnectVariables() {
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
	getCanvasAndContext();
	compileShadersAndConnectVariables();
	canvas.onmousedown = handleClick;
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

const g_points = [];
const g_colors = [];
function handleClick(e) {
	const [x, y] = eventCoordsToGL(e);

	// Store point
	g_points.push([x, y]);
	// Store color
	if (x >= 0.0 && y >= 0.0) {			// first quadrant
		g_colors.push([1.0, 0.0, 0.0, 1.0]);	// red
	} else if (x < 0.0 && y < 0.0) {	// third quadrant
		g_colors.push([0.0, 1.0, 0.0, 1.0]);	// green
	} else {							// others
		g_colors.push([1.0, 1.0, 1.0, 1.0]);	// white
	}

	render();
}

function eventCoordsToGL(e) {
	let x = e.clientX;
	let y = e.clientY;
	const rect = e.target.getBoundingClientRect();
	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
	return [x, y];
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	for(let i = 0; i < g_points.length; i++) {
		const xy = g_points[i];
		const rgba = g_colors[i];
		gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.drawArrays(gl.POINTS, 0, 1);
	}
}
