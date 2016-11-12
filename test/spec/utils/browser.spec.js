/* global describe, it, expect */
import { isNode, isNodeList } from '../../../src/utils/browser';

export default describe.bind(null, 'Browser Utilities', () => {

  describe('isNode()', () => {

    it('should return true when passed a DOM node', () => {
      const result = isNode(document.querySelector('#mocha'));
      expect(result).to.equal(true);
    });

    it('should return false when passed HTML as a string', () => {
      const result = isNode('<div class="foo"></div>');
      expect(result).to.equal(false);
    });
  });

  describe('isNodeList()', () => {

    it('should return true when passed a DOM node list', () => {
      const result = isNodeList(document.querySelectorAll('script'));
      expect(result).to.equal(true);
    });

    it('should return false when passed an array of HTML elements', () => {
      const result = isNodeList([...document.querySelectorAll('script')]);
      expect(result).to.equal(false);
    });
  });
});
