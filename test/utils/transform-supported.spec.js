import transformSupported from '../../src/utils/transform-supported'

describe('Utilities', () => {
	describe('transformSupported()', () => {
		it('should return true', () => {
			expect(transformSupported()).to.be.true
		})
	})
})
