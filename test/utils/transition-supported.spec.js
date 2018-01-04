import transitionSupported from '../../src/utils/transition-supported'

describe('Utilities', () => {
	describe('transitionSupported()', () => {
		it('should return true', () => {
			expect(transitionSupported()).to.be.true
		})
	})
})
