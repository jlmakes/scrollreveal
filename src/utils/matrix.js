export default {

	identity () {
		const matrix = [];
		for (let i = 0; i < 16; i++) {
			i % 5 == 0 ? matrix.push(1) : matrix.push(0);
		}
		return matrix;
	},


	rotateX (theta) {
		const angle = Math.PI / 180 * theta;
		const matrix = this.identity();
		matrix[5] = matrix[10] = Math.cos(angle);
		matrix[6] = Math.sin(angle);
		matrix[9] = Math.sin(angle) * -1;
		return matrix;
	},


	rotateY (theta) {
		const angle = Math.PI / 180 * theta;
		const matrix = this.identity();
		matrix[0] = matrix[10] = Math.cos(angle);
		matrix[8] = Math.sin(angle);
		matrix[2] = Math.sin(angle) * -1;
		return matrix;
	},


	rotateZ (theta) {
		const angle = Math.PI / 180 * theta;
		const matrix = this.identity();
		matrix[0] = matrix[5] = Math.cos(angle);
		matrix[1] = Math.sin(angle);
		matrix[4] = Math.sin(angle) * -1;
		return matrix;
	},


	multiply (first, second) {
		const result = [];

		for (let i = 0; i < 4; i++) {
			const row = [first[i], first[i+4], first[i+8], first[i+12]];
			for (let j = 0; j < 4; j++) {
				const col = [second[j], second[j+1], second[j+2], second[j+3]];
				result[i + j * 4] = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3];
			}
		}

		return result;
	},
};
