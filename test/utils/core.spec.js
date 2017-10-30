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

		it('should throw an error when no element matches a valid selector', () => {
			let caught
			try {
				getNode('.foo')
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceof(Error)
		})

		it('should throw an error when an invalid selector is passed', () => {
			let caught
			try {
				getNode('foo!')
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceof(Error)
		})
	})

	describe('getNodes()', () => {
		it('should return the same array of nodes when passed an array of nodes', () => {
			const actual = [].concat(document.querySelectorAll('html, body, script'))
			const result = getNodes(actual)
			expect(result).to.equal(actual)
		})

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
			const result = getNodes('.foo')
			expect(result).to.deep.equal([])
		})

		it('should throw an error when an invalid selector is passed', () => {
			let caught
			try {
				getNodes('foo!')
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceof(Error)
		})
	})

	describe('logger()', () => {
		const mock = { constructor: { debug: true } }

		let spy
		let stub

		beforeEach('stub console log', () => {
			spy = sinon.spy()
			stub = sinon.stub(console, 'log').callsFake(spy)
		})

		it('should invoke console.log', () => {
			logger.call(mock)
			expect(spy).to.have.been.called
		})

		it('should prepend output with `ScrollReveal: `', () => {
			logger.call(mock, 'test')
			const result = '%cScrollReveal: test'
			const style = 'color: #ea654b;'
			expect(spy).to.have.been.calledWith(result, style)
		})

		it('should accept multiple arguments as message details', () => {
			logger.call(mock, 'message', 'detail one', 'detail two')
			const result = '%cScrollReveal: message\n — detail one\n — detail two'
			const style = 'color: #ea654b;'
			expect(spy).to.have.been.calledWith(result, style)
		})

		afterEach('restore console log', () => stub.restore())
	})
})
