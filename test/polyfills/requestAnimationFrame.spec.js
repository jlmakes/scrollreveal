import { polyfill } from '../../src/polyfills/requestAnimationFrame';


describe('Polyfills', () => {

	describe('requestAnimationFrame()', () => {

		beforeEach('wait for animation frame clock to tick', (done) => {
			setTimeout(done, 24);
		});

		it('should be a function', () => {
			expect(polyfill).to.be.a('function');
		});

		it('should invoke callback when called', () => {
			const spy = sinon.spy();
			polyfill(spy);
			expect(spy).to.have.been.called;
		});

		it('should throttle callback invocations', () => {
			const spy = sinon.spy();
			const start = Date.now();
			do { polyfill(spy); } while (Date.now() - start < 96);
			expect(spy.callCount).to.be.at.most(7);
		});
	});
});
