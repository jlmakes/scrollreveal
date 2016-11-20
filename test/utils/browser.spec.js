/* global describe, it, expect */
import 'babel-polyfill';
import { isNode, isNodeList, transformSupported, transitionSupported } from '../../src/utils/browser';

describe('Browser Utilities', () => {

  describe('isNode()', () => {

    it('should return true when passed a DOM node', () => {
      const result = isNode(document.querySelector('body'));
      expect(result).to.be.true;
    });

    it('should return false when passed HTML as a string', () => {
      const result = isNode('<div class="foo"></div>');
      expect(result).to.be.false;
    });
  });

  describe('isNodeList()', () => {

    it('should return true when passed a DOM node list', () => {
      const result = isNodeList(document.querySelectorAll('script'));
      expect(result).to.be.true;
    });

    it('should return false when passed an array of HTML elements', () => {
      const result = isNodeList([...document.querySelectorAll('script')]);
      expect(result).to.be.false;
    });
  });

  describe('transformSupported()', () => {
    it('should return true', () => {
      expect(transformSupported()).to.be.true;
    });
  });

  describe('transitionSupported()', () => {
    it('should return true', () => {
      expect(transitionSupported()).to.be.true;
    });
  });
});
