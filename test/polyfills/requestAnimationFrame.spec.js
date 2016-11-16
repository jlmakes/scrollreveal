/* global describe, it, expect, sinon */
import { polyfill } from '../../src/polyfills/requestAnimationFrame';

describe('Polyfills', () => {

  describe('requestAnimationFrame()', () => {

    it('should be function', () => {
      expect(polyfill).to.be.a('function');
    });

    it('should invoke callback when called', () => {
      const spy = sinon.spy();
      polyfill(spy);
      setTimeout(() => {
        expect(spy).to.have.been.called;
      }, 0);
    });

    it('should throttle callback invocations', () => {
      const spy = sinon.spy();
      polyfill(spy);
      polyfill(spy);
      polyfill(spy);
      setTimeout(() => {
        expect(spy).to.have.been.calledOnce;
      }, 75);
    });
  });
});
