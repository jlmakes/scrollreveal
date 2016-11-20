/* global describe, it, expect, sinon */
import { getContainerElement } from '../../src/core/functions';

describe('Core Functions', () => {

  describe('getContainerElement()', () => {

    it('should return the same DOM node when passed a DOM node', () => {
      const actual = document.documentElement;
      const result = getContainerElement(actual);
      expect(result).to.equal(actual);
    });

    it('should return a DOM node when passed a valid selector', () => {
      const actual = document.documentElement;
      const result = getContainerElement('html');
      expect(result).to.equal(actual);
    });

    it('should return null when no element matches a valid selector', () => {
      const stub = sinon.stub(console, 'log');
      const result = getContainerElement('.foo');
      stub.restore();
      expect(result).to.be.null;
    });

    it('should return null when an invalid selector is passed', () => {
      const stub = sinon.stub(console, 'log');
      const result = getContainerElement('.foo!');
      stub.restore();
      expect(result).to.be.null;
    });

    it('should output to log when no element matches a valid selector', () => {
      const spy = sinon.spy();
      const stub = sinon.stub(console, 'log', spy);
      getContainerElement('.foo');
      stub.restore();
      expect(spy).to.have.been.called;
    });

    it('should output to log when an invalid selector is passed', () => {
      const spy = sinon.spy();
      const stub = sinon.stub(console, 'log', spy);
      getContainerElement('.foo!');
      stub.restore();
      expect(spy).to.have.been.called;
    });
  });
});
