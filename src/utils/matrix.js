export default {

	identity () {
		const matrix = [];
		for (let i = 0; i < 16; i++) {
			i % 5 == 0 ? matrix.push(1) : matrix.push(0);
		}
		return matrix;
	},


	multiply (m, x) {
		const sum = [];
		for (let i = 0; i < 4; i++) {
			const r = [m[i], m[i + 4], m[i + 8], m[i + 12]];
			for (let j = 0; j < 4; j++) {
				const k = j * 4;
				const c = [x[k], x[k + 1], x[k + 2], x[k + 3]];
				let result = r[0] * c[0] + r[1] * c[1] + r[2] * c[2] + r[3] * c[3];
				sum[i + k] = parseFloat(result.toPrecision(6));
			}
		}
		return sum;
	},


	rotateX (theta) {
		const angle = Math.PI / 180 * theta;
		const matrix = this.identity();
		matrix[5] = matrix[10] = parseFloat(Math.cos(angle).toPrecision(6));
		matrix[6] = parseFloat(Math.sin(angle).toPrecision(6));
		matrix[9] = parseFloat(Math.sin(angle).toPrecision(6)) * -1;
		return matrix;
	},


	rotateY (theta) {
		const angle = Math.PI / 180 * theta;
		const matrix = this.identity();
		matrix[0] = matrix[10] = parseFloat(Math.cos(angle).toPrecision(6));
		matrix[8] = parseFloat(Math.sin(angle).toPrecision(6));
		matrix[2] = parseFloat(Math.sin(angle).toPrecision(6)) * -1;
		return matrix;
	},


	rotateZ (theta) {
		const angle = Math.PI / 180 * theta;
		const matrix = this.identity();
		matrix[0] = matrix[5] = parseFloat(Math.cos(angle).toPrecision(6));
		matrix[1] = parseFloat(Math.sin(angle).toPrecision(6));
		matrix[4] = parseFloat(Math.sin(angle).toPrecision(6)) * -1;
		return matrix;
	},


	scale (scalar) {
		const matrix = this.identity();
		matrix[0] = matrix[5] = scalar;
		return matrix;
	},


	translateX (distance) {
		const matrix = this.identity();
		matrix[12] = distance;
		return matrix;
	},


	translateY (distance) {
		const matrix = this.identity();
		matrix[13] = distance;
		return matrix;
	},
};
