import isObject from '../../src/utils/is-object'

describe('Utilities', () => {
	describe('isObject()', () => {
		it('should return true when passed an object literal', () => {
			const result = isObject({})
			expect(result).to.be.true
		})

		it('should return false when passed a function', () => {
			const result = isObject(() => {})
			expect(result).to.be.false
		})

		it('should return false when passed an array', () => {
			const result = isObject([])
			expect(result).to.be.false
		})

		it('should return false when passed null', () => {
			const result = isObject(null)
			expect(result).to.be.false
		})

		it('should return false when passed undefined', () => {
			const result = isObject(undefined)
			expect(result).to.be.false
		})
	})
})
