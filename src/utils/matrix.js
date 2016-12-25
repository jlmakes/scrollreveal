export function identity () {
	const matrix = []
	for (let i = 0; i < 16; i++) {
		i % 5 == 0 ? matrix.push(1) : matrix.push(0)
	}
	return matrix
}


export function multiply (m, x) {
	if (m.length !== 16 || x.length !== 16)
		throw new RangeError('Expected arrays with 16 values.')

	const sum = []
	for (let i = 0; i < 4; i++) {
		const row = [m[i], m[i + 4], m[i + 8], m[i + 12]]
		for (let j = 0; j < 4; j++) {
			const k = j * 4
			const col = [x[k], x[k + 1], x[k + 2], x[k + 3]]
			let result = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3]
			sum[i + k] = parseFloat(result.toPrecision(6))
		}
	}
	return sum
}


export function rotateX (theta) {
	const angle = Math.PI / 180 * theta
	const matrix = identity()
	matrix[5] = matrix[10] = parseFloat(Math.cos(angle).toPrecision(6))
	matrix[6] = parseFloat(Math.sin(angle).toPrecision(6))
	matrix[9] = parseFloat(Math.sin(angle).toPrecision(6)) * -1
	return matrix
}


export function rotateY (theta) {
	const angle = Math.PI / 180 * theta
	const matrix = identity()
	matrix[0] = matrix[10] = parseFloat(Math.cos(angle).toPrecision(6))
	matrix[8] = parseFloat(Math.sin(angle).toPrecision(6))
	matrix[2] = parseFloat(Math.sin(angle).toPrecision(6)) * -1
	return matrix
}


export function rotateZ (theta) {
	const angle = Math.PI / 180 * theta
	const matrix = identity()
	matrix[0] = matrix[5] = parseFloat(Math.cos(angle).toPrecision(6))
	matrix[1] = parseFloat(Math.sin(angle).toPrecision(6))
	matrix[4] = parseFloat(Math.sin(angle).toPrecision(6)) * -1
	return matrix
}


export function scale (scalar) {
	const matrix = identity()
	matrix[0] = matrix[5] = scalar
	return matrix
}


export function translateX (distance) {
	const matrix = identity()
	matrix[12] = distance
	return matrix
}


export function translateY (distance) {
	const matrix = identity()
	matrix[13] = distance
	return matrix
}
