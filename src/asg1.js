const VSHADER_SOURCE = `
	attribute vec4 a_Position;
	uniform float u_Size;
	void main() {
		gl_Position = a_Position;
		gl_PointSize = u_Size;
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
let u_Size;
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

	a_Position = gl.getAttribLocation(gl.program, "a_Position");
	if (a_Position < 0) {
		throw new Error("Failed to get the storage location of a_Position");
		return;
	}

	u_Size = gl.getUniformLocation(gl.program, "u_Size");
	if (!u_Size) {
		throw new Error("Failed to get the storage location of u_Size");
		return;
	}

	u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
	if (!u_FragColor) {
		throw new Error("Failed to get the storage location of u_FragColor");
		return;
	}
}

const g_selectedColor = [1.0, 1.0, 1.0, 1.0];		// white
let g_selectedSize = 5;
function addHtmlUIActions() {
	document.getElementById("slider_r").addEventListener("mouseup", function() { g_selectedColor[0] = this.value / 100; });
	document.getElementById("slider_g").addEventListener("mouseup", function() { g_selectedColor[1] = this.value / 100; });
	document.getElementById("slider_b").addEventListener("mouseup", function() { g_selectedColor[2] = this.value / 100; });
	document.getElementById("slider_size").addEventListener("mouseup", function() { g_selectedSize = this.value; });
}

function main() {
	getCanvasAndContext();
	compileShadersAndConnectVariables();
	addHtmlUIActions();
	canvas.onmousedown = handleClick;
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

const g_points = [];
const g_colors = [];
const g_sizes = [];
function handleClick(e) {
	const [x, y] = eventCoordsToGL(e);

	g_points.push([x, y]);
	g_colors.push(g_selectedColor.slice());		// use slice to get a copy
	g_sizes.push(g_selectedSize);

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
		const size = g_sizes[i];

		gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
		gl.uniform1f(u_Size, size);
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		gl.drawArrays(gl.POINTS, 0, 1);
	}
}
