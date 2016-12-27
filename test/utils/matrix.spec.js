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

		it('should return a 4x4 matrix equal to the product of both arguments', () => {
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

	describe('Transformation', () => {

		let dummy
		let transformProperty


		before('create dummy object', () => {
			dummy = document.createElement('div')
			document.body.appendChild(dummy)

			const computed = window.getComputedStyle(dummy)

			if (typeof computed['transform'] === 'string')
				return transformProperty = 'transform'
			if (typeof computed['-webkit-transform'] === 'string')
				return transformProperty = '-webkit-transform'
		})

		beforeEach('clean dummy object', () => {
			dummy.removeAttribute('style')
		})

		function getTransformAsArray (node) {
			const computedTransform = window.getComputedStyle(node)[transformProperty]
			const match = computedTransform.match(/\(([^)]+)\)/)[1]
			const values = match.split(', ').map(value => parseFloat(value))
			return matrix.format(values)
		}

		describe('rotateX()', () => {
			it('should generate an equivalent 4x4 matrix to CSS transform rotateX', () => {
				dummy.setAttribute('style', `${transformProperty}: rotateX(45deg)`)
				const result = matrix.rotateX(45)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		describe('rotateY()', () => {
			it('should generate an equivalent 4x4 matrix to CSS transform rotateY', () => {
				dummy.setAttribute('style', `${transformProperty}: rotateY(45deg)`)
				const result = matrix.rotateY(45)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		describe('rotateZ()', () => {
			it('should generate an equivalent 4x4 matrix to CSS transform rotateZ', () => {
				dummy.setAttribute('style', `${transformProperty}: rotateZ(45deg)`)
				const result = matrix.rotateZ(45)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		describe('scale()', () => {
			it('should generate an equivalent 4x4 matrix to CSS transform scale', () => {
				dummy.setAttribute('style', `${transformProperty}: scale(2)`)
				const result = matrix.scale(2)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		describe('translateX', () => {
			it('should generate an equivalent 4x4 matrix to CSS transform translateX', () => {
				dummy.setAttribute('style', `${transformProperty}: translateX(20px)`)
				const result = matrix.translateX(20)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		describe('translateY', () => {
			it('should generate an equivalent 4x4 matrix to CSS transform translateY', () => {
				dummy.setAttribute('style', `${transformProperty}: translateY(20px)`)
				const result = matrix.translateY(20)
				const answer = getTransformAsArray(dummy)
				expect(result).to.be.eql(answer)
			})
		})

		after('remove dummy object', () => {
			document.body.removeChild(dummy)
		})
	})
})
