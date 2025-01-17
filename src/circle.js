class Circle {
	constructor() {
		this.pos = [0.0, 0.0, 0.0];
		this.color = [1.0, 1.0, 1.0, 1.0];  // white
		this.size = 5;
		this.segments = 10;
	}

	render() {
		const xy = this.pos;
		const size = this.size;
		const rgba = this.color;

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		const d = size / 400;	// delta
		const step = 360 / this.segments;
		for (let angle = 0; angle < 360; angle += step) {
			const centerPt = [xy[0], xy[1]];
			const angle1 = angle;
			const angle2 = angle + step;
			const vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
            const vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
			const pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
			const pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];

			drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
		}
	}
}