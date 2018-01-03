import { polyfill } from '../../src/polyfills/raf'

describe('Polyfills', () => {
	describe('raf()', () => {
		beforeEach('wait for animation frame clock to tick', done => {
			setTimeout(done, 24)
		})

		it('should be a function', () => {
			expect(polyfill).to.be.a('function')
		})

		it('should invoke callback', () => {
			const spy = sinon.spy()
			polyfill(spy)
			expect(spy).to.have.been.called
		})

		/**
		 * Smooth animation of 60fps = 16ms per frame.
		 * 96ms should be enough time for 6 frames...
		 * but off by one errors here are acceptable.
		 */
		it('should throttle to 60fps', () => {
			const spy = sinon.spy()
			const start = Date.now()
			do {
				polyfill(spy)
			} while (Date.now() - start < 96)
			expect(spy.callCount).to.be.at.least(5)
			expect(spy.callCount).to.be.at.most(7)
		})
	})
})
