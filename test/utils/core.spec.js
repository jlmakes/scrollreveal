import { getNode, getNodes, logger } from '../../src/utils/core'


describe('Core Utilities', () => {

	describe('getNode()', () => {

		it('should return the same node when passed a node', () => {
			const actual = document.documentElement
			const result = getNode(actual)
			expect(result).to.equal(actual)
		})

		it('should return a node when passed a valid selector', () => {
			const actual = document.documentElement
			const result = getNode('html')
			expect(result).to.equal(actual)
		})

		it('should return null when no element matches a valid selector', () => {
			const stub = sinon.stub(console, 'log')
			const result = getNode('.foo')
			stub.restore()
			expect(result).to.be.null
		})

		it('should return null when an invalid selector is passed', () => {
			const stub = sinon.stub(console, 'log')
			const result = getNode('.foo!')
			stub.restore()
			expect(result).to.be.null
		})

		it('should output to log when no element matches a valid selector', () => {
			const spy = sinon.spy()
			const stub = sinon.stub(console, 'log', spy)
			getNode('.foo')
			stub.restore()
			expect(spy).to.have.been.called
		})

		it('should output to log when an invalid selector is passed', () => {
			const spy = sinon.spy()
			const stub = sinon.stub(console, 'log', spy)
			getNode('.foo!')
			stub.restore()
			expect(spy).to.have.been.called
		})
	})

	describe('getNodes()', () => {

		it('should return an array containing the same node when passed a node', () => {
			const element = document.documentElement
			const actual = [element]
			const result = getNodes(element)
			expect(result).to.deep.equal(actual)
		})

		it('should return an array of nodes when passed a node list', () => {
			const elements = document.querySelectorAll('body')
			const actual = Array.prototype.slice.call(elements)
			const result = getNodes(elements)
			expect(result).to.deep.equal(actual)
		})

		it('should return an array of nodes when passed a valid selector', () => {
			const actual = [document.documentElement]
			const result = getNodes('html')
			expect(result).to.deep.equal(actual)
		})

		it('should return an empty array when no element matches a valid selector', () => {
			const stub = sinon.stub(console, 'log')
			const result = getNodes('.foo')
			stub.restore()
			expect(result).to.deep.equal([])
		})

		it('should return an empty array when an invalid selector is passed', () => {
			const stub = sinon.stub(console, 'log')
			const result = getNodes('.foo!')
			stub.restore()
			expect(result).to.deep.equal([])
		})

		it('should output to log when no element matches a valid selector', () => {
			const spy = sinon.spy()
			const stub = sinon.stub(console, 'log', spy)
			getNodes('.foo')
			stub.restore()
			expect(spy).to.have.been.called
		})

		it('should output to log when an invalid selector is passed', () => {
			const spy = sinon.spy()
			const stub = sinon.stub(console, 'log', spy)
			getNodes('.foo!')
			stub.restore()
			expect(spy).to.have.been.called
		})
	})

	describe('logger()', () => {

		let spy
		let stub

		before('stub console log', () => {
			spy = sinon.spy()
			stub = sinon.stub(console, 'log', spy)
		})

		it('should invoke console.log', () => {
			logger()
			expect(spy).to.have.been.called
		})

		it('should prepend output with `ScrollReveal: `', () => {
			logger('test')
			expect(spy).to.have.been.calledWith('ScrollReveal: test')
		})

		after('restore console log', () => {
			stub.restore()
		})
	})
})
