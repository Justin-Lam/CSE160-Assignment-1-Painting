class Triangle {
	constructor() {
		this.shape = "triangle";
		this.pos = [0.0, 0.0, 0.0];
		this.color = [1.0, 1.0, 1.0, 1.0];	// white
		this.size = 5;
	}

	render() {
        const size = this.size;
		const rgba = this.color;

		gl.uniform1f(u_Size, size);
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		this.draw();
	}

	draw() {
		const xy = this.pos;
		const d = this.size / 400;	// delta
		const vertices = [xy[0], xy[1]+d, xy[0]-d, xy[1]-d, xy[0]+d, xy[1]-d];
		//		1
		//		xy
		//	2		3

		const vertexBuffer = gl.createBuffer();
		if (!vertexBuffer) {
			throw new Error("Failed to create the buffer object");
		}

		// Bind buffer obj to target
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

		// Write data into buffer obj
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW)

		// Assign buffer obj to a_Position
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

		// Enable the assignment to a_Position
		gl.enableVertexAttribArray(a_Position);

		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
}