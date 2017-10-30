import { polyfill } from '../../src/polyfills/mathSign'

describe('Polyfills', () => {
	describe('mathSign()', () => {
		it('should be a function', () => {
			expect(polyfill).to.be.a('function')
		})

		it('should return -1 when passed values less than 0', () => {
			expect(polyfill(-500)).to.equal(-1)
		})

		it('should return 1 for values greater than 0', () => {
			expect(polyfill(500)).to.equal(1)
		})

		it('should return 1 when passed true', () => {
			expect(polyfill(true)).to.equal(1)
		})

		it('should return -0 when passed -0', () => {
			expect(polyfill(-0)).to.equal(-0)
		})

		it('should return 0 when passed 0', () => {
			expect(polyfill(0)).to.equal(0)
		})

		it('should return 0 when passed falsey values', () => {
			expect(polyfill(false)).to.equal(0)
			expect(polyfill('')).to.equal(0)
			expect(polyfill([])).to.equal(0)
			expect(polyfill(null)).to.equal(0)
		})

		it('should return NaN when passed non-falsey non-numbers', () => {
			expect(polyfill('foo')).to.be.NaN
			expect(polyfill({})).to.be.NaN
			expect(polyfill([1, 2, 3])).to.be.NaN
		})
	})
})
