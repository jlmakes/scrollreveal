/* global describe, it, expect, sinon */
import { isObject, logger, nextUniqueId } from '../../src/utils/generic';

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
