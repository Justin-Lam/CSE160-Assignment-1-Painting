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
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
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
function createUIEvents() {
	document.getElementById("clearButton").onclick = function() {
		g_shapesList = [];
		render();
	};
	document.getElementById("slider_r").addEventListener("mouseup", function() { g_selectedColor[0] = this.value / 100; });
	document.getElementById("slider_g").addEventListener("mouseup", function() { g_selectedColor[1] = this.value / 100; });
	document.getElementById("slider_b").addEventListener("mouseup", function() { g_selectedColor[2] = this.value / 100; });
	document.getElementById("slider_size").addEventListener("mouseup", function() { g_selectedSize = this.value; });
}

function main() {
	getCanvasAndContext();
	compileShadersAndConnectVariables();
	createUIEvents();
	canvas.onmousemove = function(e) { if (e.buttons === 1) { handleClick(e) } };
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

let g_shapesList = [];
function handleClick(e) {
	const [x, y] = eventCoordsToGL(e);

	const point = new Point();
	point.pos = [x, y];
	point.color = g_selectedColor.slice();
	point.size = g_selectedSize;
	g_shapesList.push(point);

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
	for(let i = 0; i < g_shapesList.length; i++) {
		g_shapesList[i].render();
	}
}
