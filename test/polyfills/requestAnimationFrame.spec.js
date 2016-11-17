/* global describe, it, expect, sinon */
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
      polyfill(spy);
      polyfill(spy);
      polyfill(spy);
      expect(spy).to.have.been.calledOnce;
    });
  });
});
