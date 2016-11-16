/* global describe, it, expect */
import requestAnimationFrame from '../../src/polyfills/requestAnimationFrame';

describe('Polyfills', () => {

  describe('requestAnimationFrame()', () => {

    it('should be function', () => {
      const result = requestAnimationFrame;
      expect(result).to.be.a('function');
    });

    // it('should throttle callback calls', () => {
    //   // ...
    // });
  });
});
