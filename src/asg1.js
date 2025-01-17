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
	gl = canvas.getContext("webgl", {
		preserveDrawingBuffer: true,
		premultipliedAlpha: false		// learned I need to do this for alpha to work from https://webglfundamentals.org/webgl/lessons/webgl-and-alpha.html
	});
	if (!gl) {
		throw new Error("Failed to get the rendering context for WebGL");
	}
}

function compileShadersAndConnectVariables() {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw new Error("Failed to intialize shaders");
	}

	a_Position = gl.getAttribLocation(gl.program, "a_Position");
	if (a_Position < 0) {
		throw new Error("Failed to get the storage location of a_Position");
	}

	u_Size = gl.getUniformLocation(gl.program, "u_Size");
	if (!u_Size) {
		throw new Error("Failed to get the storage location of u_Size");
	}

	u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
	if (!u_FragColor) {
		throw new Error("Failed to get the storage location of u_FragColor");
	}
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let g_selectedShape = POINT;
const g_selectedColor = [1.0, 1.0, 1.0, 1.0];		// white
let g_selectedSize = 5;
let g_selectedCircleSegments = 10;
function createUIEvents() {
	document.getElementById("pointButton").onclick = function() { g_selectedShape = POINT; };
	document.getElementById("triangleButton").onclick = function() { g_selectedShape = TRIANGLE; };
	document.getElementById("circleButton").onclick = function() { g_selectedShape = CIRCLE; };
	document.getElementById("drawImageButton").onclick = function() {
		const image = new Image();
		image.alpha = g_selectedColor[3];
		g_shapesList.push(image);
		render();
	};
	document.getElementById("clearButton").onclick = function() {
		g_shapesList = [];
		render();
	};
	document.getElementById("slider_r").addEventListener("mouseup", function() { g_selectedColor[0] = this.value / 100; });
	document.getElementById("slider_g").addEventListener("mouseup", function() { g_selectedColor[1] = this.value / 100; });
	document.getElementById("slider_b").addEventListener("mouseup", function() { g_selectedColor[2] = this.value / 100; });
	document.getElementById("slider_a").addEventListener("mouseup", function() { g_selectedColor[3] = this.value / 100; });
	document.getElementById("slider_size").addEventListener("mouseup", function() { g_selectedSize = this.value; });
	document.getElementById("slider_cirSeg").addEventListener("mouseup", function() { g_selectedCircleSegments = this.value; });
}

function main() {
	getCanvasAndContext();
	compileShadersAndConnectVariables();
	createUIEvents();
	canvas.onmousedown = handleClick;
	canvas.onmousemove = function(e) { if (e.buttons === 1) { handleClick(e) } };
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

let g_shapesList = [];
function handleClick(e) {
	const [x, y] = eventCoordsToGL(e);

	let shape = null;
	if (g_selectedShape === POINT) {
		shape = new Point();
	}
	else if (g_selectedShape === TRIANGLE) {
		shape = new Triangle();
	}
	else {
		shape = new Circle();
		shape.segments = g_selectedCircleSegments;
	}
	shape.pos = [x, y];
	shape.color = g_selectedColor.slice();
	shape.size = g_selectedSize;
	g_shapesList.push(shape);

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