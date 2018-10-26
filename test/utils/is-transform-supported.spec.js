import isTransformSupported from '../../src/utils/is-transform-supported'

describe('Utilities', () => {
	describe('isTransformSupported()', () => {
		it('should return true', () => {
			expect(isTransformSupported()).to.be.true
		})
	})
})
