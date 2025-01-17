class Image {
	render() {
		// used https://rgbcolorpicker.com/0-1 to get colors
		const LIGHT_BLUE = [0.49, 0.847, 0.949];
		const LIGHT_ORANGE = [1, 0.871, 0.416];
		const TAN = [1, 0.996, 0.878];
		const YELLOW = [1, 0.855, 0];
		const YELLOW_SHADED = [0.769, 0.659, 0];
		const BROWN = [0.588, 0.365, 0];
		const LIGHT_GREEN = [0, 0.82, 0.059];
		const DARK_GREEN = [0.18, 0.612, 0.043];

		// Sky
		setColor(LIGHT_BLUE);
		drawTriangle([-1.0, 1.0, -1.0, 0.5, 1.0, 0.5]);
		drawTriangle([1.0, 1.0, -1.0, 1.0, 1.0, 0.5]);

		// Ground
		setColor(LIGHT_ORANGE);
		drawTriangle([-1.0, 0.5, -1.0, -1.0, 1.0, -1.0]);
		drawTriangle([1.0, 0.5, -1.0, 0.5, 1.0, -1.0]);

		// Road
		setColor(TAN);	// white
		drawTriangle([0.0, 0.5, -0.25, -1.0, 0.25, -1.0]);

		// Left Pyramid
		setColor(YELLOW);
		drawTriangle([-0.55, 0.6, -0.9, -0.15, -0.20, -0.15]);
		setColor(YELLOW_SHADED);
		drawTriangle([-0.55, 0.6, -0.2, -0.15, -0.125, 0.2]);

		// Right Pyramid
		setColor(YELLOW);
		drawTriangle([0.55, 0.6, 0.9, -0.15, 0.20, -0.15]);
		setColor(YELLOW_SHADED);
		drawTriangle([0.55, 0.6, 0.2, -0.15, 0.125, 0.2]);

		// Left Palm Tree
		setColor(BROWN);										// trunk
		drawTriangle([-0.5, -0.2, -0.6, -0.9, -0.5, -0.9]);
		drawTriangle([-0.6, -0.2, -0.6, -0.9, -0.5, -0.2]);
		setColor(DARK_GREEN);									// left back leaf
		drawTriangle([-0.7, -0.05, -0.6, -0.2, -0.5, -0.2]);
		drawTriangle([-0.7, -0.05, -0.9, -0.4, -0.6, -0.1]);
		setColor(DARK_GREEN);									// right back leaf
		drawTriangle([-0.4, -0.05, -0.6, -0.2, -0.5, -0.2]);
		drawTriangle([-0.4, -0.05, -0.5, -0.1, -0.2, -0.4]);
		setColor(LIGHT_GREEN);									// left front leaf
		drawTriangle([-0.6, 0.0, -0.6, -0.2, -0.55, -0.2]);
		drawTriangle([-0.6, 0.0, -0.8, -0.5, -0.6, -0.1]);
		setColor(LIGHT_GREEN);									// right front leaf
		drawTriangle([-0.5, 0.0, -0.55, -0.2, -0.5, -0.2]);
		drawTriangle([-0.5, 0.0, -0.5, -0.1, -0.3, -0.5]);

		// Right Palm Tree
		setColor(BROWN);										// trunk
		drawTriangle([0.5, -0.2, 0.6, -0.9, 0.5, -0.9]);
		drawTriangle([0.6, -0.2, 0.6, -0.9, 0.5, -0.2]);
		setColor(DARK_GREEN);									// left back leaf
		drawTriangle([0.4, -0.05, 0.6, -0.2, 0.5, -0.2]);
		drawTriangle([0.4, -0.05, 0.5, -0.1, 0.2, -0.4]);
		setColor(DARK_GREEN);									// right back leaf
		drawTriangle([0.7, -0.05, 0.6, -0.2, 0.5, -0.2]);
		drawTriangle([0.7, -0.05, 0.9, -0.4, 0.6, -0.1]);
		setColor(LIGHT_GREEN);									// left front leaf
		drawTriangle([0.5, 0.0, 0.55, -0.2, 0.5, -0.2]);
		drawTriangle([0.5, 0.0, 0.5, -0.1, 0.3, -0.5]);
		setColor(LIGHT_GREEN);									// right front leaf
		drawTriangle([0.6, 0.0, 0.6, -0.2, 0.55, -0.2]);
		drawTriangle([0.6, 0.0, 0.8, -0.5, 0.6, -0.1]);

		function setColor(color) {
			gl.uniform4f(u_FragColor, color[0], color[1], color[2], 1.0);
		}
	}
}