class Point {
	constructor() {
		this.pos = [0.0, 0.0, 0.0];
		this.color = [1.0, 1.0, 1.0, 1.0];	// white
		this.size = 5;
	}

	render() {
		const xy = this.pos;
		const size = this.size;
		const rgba = this.color;

		// Quit using the buffer to send the attribute
		gl.disableVertexAttribArray(a_Position);

		// Write data into variables
		gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
		gl.uniform1f(u_Size, size);
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		gl.drawArrays(gl.POINTS, 0, 1);
	}
}