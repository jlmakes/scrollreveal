/* global describe, it, expect, sinon */
import { getElement, getElements } from '../../src/core/functions';

describe('Core Functions', () => {

	describe('getElement()', () => {

		it('should return the same node when passed a node', () => {
			const actual = document.documentElement;
			const result = getElement(actual);
			expect(result).to.equal(actual);
		});

		it('should return a node when passed a valid selector', () => {
			const actual = document.documentElement;
			const result = getElement('html');
			expect(result).to.equal(actual);
		});

		it('should return null when no element matches a valid selector', () => {
			const stub = sinon.stub(console, 'log');
			const result = getElement('.foo');
			stub.restore();
			expect(result).to.be.null;
		});

		it('should return null when an invalid selector is passed', () => {
			const stub = sinon.stub(console, 'log');
			const result = getElement('.foo!');
			stub.restore();
			expect(result).to.be.null;
		});

		it('should output to log when no element matches a valid selector', () => {
			const spy = sinon.spy();
			const stub = sinon.stub(console, 'log', spy);
			getElement('.foo');
			stub.restore();
			expect(spy).to.have.been.called;
		});

		it('should output to log when an invalid selector is passed', () => {
			const spy = sinon.spy();
			const stub = sinon.stub(console, 'log', spy);
			getElement('.foo!');
			stub.restore();
			expect(spy).to.have.been.called;
		});
	});

	describe('getElements()', () => {

		it('should return an array containing the same node when passed a node', () => {
			const element = document.documentElement;
			const actual = [element];
			const result = getElements(element);
			expect(result).to.deep.equal(actual);
		});

		it('should return an array of nodes when passed a node list', () => {
			const elements = document.querySelectorAll('body');
			const actual = Array.prototype.slice.call(elements);
			const result = getElements(elements);
			expect(result).to.deep.equal(actual);
		});

		it('should return an array of nodes when passed a valid selector', () => {
			const actual = [document.documentElement];
			const result = getElements('html');
			expect(result).to.deep.equal(actual);
		});

		it('should return an empty array when no element matches a valid selector', () => {
			const stub = sinon.stub(console, 'log');
			const result = getElements('.foo');
			stub.restore();
			expect(result).to.deep.equal([]);
		});

		it('should return an empty array when an invalid selector is passed', () => {
			const stub = sinon.stub(console, 'log');
			const result = getElements('.foo!');
			stub.restore();
			expect(result).to.deep.equal([]);
		});

		it('should output to log when no element matches a valid selector', () => {
			const spy = sinon.spy();
			const stub = sinon.stub(console, 'log', spy);
			getElements('.foo');
			stub.restore();
			expect(spy).to.have.been.called;
		});

		it('should output to log when an invalid selector is passed', () => {
			const spy = sinon.spy();
			const stub = sinon.stub(console, 'log', spy);
			getElements('.foo!');
			stub.restore();
			expect(spy).to.have.been.called;
		});
	});
});
