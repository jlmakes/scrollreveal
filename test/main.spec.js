/* global describe, it, expect, sinon*/
import ScrollReveal from '../src/main';

describe('ScrollReveal', () => {

  describe('Constructor', () => {

    it('should return a new instance with `new` keyword', () => {
      const result = new ScrollReveal();
      expect(result).to.exist;
    });

    it('should return a new instance without `new` keyword', () => {
      const result = ScrollReveal();
      expect(result).to.exist;
    });

    it('should add the class `sr` to `<html>` element', () => {
      const sr = new ScrollReveal();
      const result = document.documentElement.classList.contains('sr');
      expect(result).to.be.true;
    });

    it('should return a noop instance when not supported', () => {
      const stub = sinon.stub(ScrollReveal, 'isSupported');
      const result = new ScrollReveal().initialized;
      expect(result).to.not.exist;
      stub.restore();
    });

  });

  describe('Instance', () => {

    it('should have a `remove` method', () => {
      const sr = new ScrollReveal();
      const result = sr.remove;
      expect(result).to.exist;
      expect(result).to.be.a('function');
    });

    it('should have a `reveal` method', () => {
      const sr = new ScrollReveal();
      const result = sr.reveal;
      expect(result).to.exist;
      expect(result).to.be.a('function');
    });

    it('should have a `sync` method', () => {
      const sr = new ScrollReveal();
      const result = sr.sync;
      expect(result).to.exist;
      expect(result).to.be.a('function');
    });

    it('should have a `watch` method', () => {
      const sr = new ScrollReveal();
      const result = sr.watch;
      expect(result).to.exist;
      expect(result).to.be.a('function');
    });
  });
});
