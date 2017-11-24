import { logger } from '../../src/utils/core'

describe('Core Utilities', () => {
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
