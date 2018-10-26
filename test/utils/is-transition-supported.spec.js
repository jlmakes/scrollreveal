import isTransitionSupported from '../../src/utils/is-transition-supported'

describe('Utilities', () => {
	describe('isTransitionSupported()', () => {
		it('should return true', () => {
			expect(isTransitionSupported()).to.be.true
		})
	})
})
