import * as matrix from '../../src/utils/matrix'


describe('Matrix Utilities', () => {

	describe('format()', () => {
		/**
		 * matrix(a, b, c, d, tx, ty) is a shorthand for:
		 * matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1)
		 * Source: https://goo.gl/7mJsfK
		 */
		it('should convert CSS transform matrix to matrix3d', () => {
			const source = [1, 2, 3, 4, 5, 6]
			const answer = [1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 1, 0, 5, 6, 0, 1]
			expect(matrix.format(source)).to.eql(answer)
		})

		it('should return source argument if it is already matrix3d format', () => {
			const source = [1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 1, 0, 5, 6, 0, 1]
			expect(matrix.format(source)).to.equal(source)
		})

		it('should throw a type error when passed a non-array', () => {
			let caught
			try {
				matrix.format({ foo: 'bar' })
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceOf(TypeError)
		})

		it('should throw a range error when passed an array of invalid length', () => {
			let caught
			try {
				matrix.format([])
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceOf(RangeError)
		})
	})

	describe('identity()', () => {
		it('should return a 4x4 identity matrix in column-major order', () => {
			const result = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
			expect(matrix.identity()).to.eql(result)
		})
	})

	describe('multiply()', () => {

		it('should return a 4x4 matrix equal to the sum of its two 4x4 matrix args', () => {
			const first = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
			const second = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
			const answer = [386, 444, 502, 560, 274, 316, 358, 400, 162, 188, 214, 240, 50, 60, 70, 80]
			expect(matrix.multiply(first, second)).to.eql(answer)
		})

		it('should throw a range error when passed an array without 16 values', () => {
			const first = [1, 2, 3, 4, 5, 6]
			const second = matrix.identity()
			let caught
			try {
				matrix.multiply(first, second)
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceOf(RangeError)
		})
	})
})
