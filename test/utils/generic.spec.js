/* global describe, it, expect, sinon */
import { isObject, forOwn, logger, nextUniqueId } from '../../src/utils/generic';

describe('Generic Utilities', () => {

	describe('isObject()', () => {

		it('should return true when passed an object literal', () => {
			const result = isObject({});
			expect(result).to.be.true;
		});

		it('should return false when passed a function', () => {
			const result = isObject(function(){});
			expect(result).to.be.false;
		});

		it('should return false when passed an array', () => {
			const result = isObject([]);
			expect(result).to.be.false;
		});

		it('should return false when passed null', () => {
			const result = isObject(null);
			expect(result).to.be.false;
		});
	});

	describe('forOwn()', () => {

		function Fixture () {
			this.foo = 'bar';
			this.baz = 'bun';
		}

		it('should invoke callback for each property', () => {
			let fixture = new Fixture();
			const spy = sinon.spy();
			forOwn(fixture, spy);
			expect(spy).to.have.been.calledTwice;
		});

		it('should ignore properties on the prototype chain', () => {
			Fixture.prototype.biff = 'baff';
			let fixture = new Fixture();
			const spy = sinon.spy();
			forOwn(fixture, spy);
			expect(spy).to.have.been.calledTwice;
		});

		it('should output to log when not passed an object literal', () => {
			const spy = sinon.spy();
			const stub = sinon.stub(console, 'log', spy);
			forOwn(null, () => {});
			stub.restore();
			expect(spy).to.have.been.called;
		});
	});

	describe('logger()', () => {

		let spy;
		let stub;

		before('stub console log', () => {
			spy = sinon.spy();
			stub = sinon.stub(console, 'log', spy);
		});

		it('should invoke console.log', () => {
			logger();
			expect(spy).to.have.been.called;
		});

		it('should prepend output with `ScrollReveal: `', () => {
			logger('test');
			expect(spy).to.have.been.calledWith('ScrollReveal: test');
		});

		after('restore console log', () => {
			stub.restore();
		});
	});

	describe('nextUniqueId()', () => {

		it('should start at 0', () => {
			const result = nextUniqueId();
			expect(result).to.equal(0);
		});

		it('should increment by 1', () => {
			const result = nextUniqueId();
			expect(result).to.equal(1);
		});

		it('should return a number', () => {
			const result = nextUniqueId();
			expect(result).to.be.a('number');
		});
	});
});
