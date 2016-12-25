import { noop } from '../../src/instance/noop'


describe('ScrollReveal', () => {

	describe('Non-operational Instance', () => {

		it('should have a `noop` property set to `true`', () => {
			expect(noop.noop).to.exist
			expect(noop.noop).to.be.true
		})

		it('should have a `remove` method', () => {
			expect(noop.remove).to.exist
			expect(noop.remove).to.be.a('function')
		})

		it('should have a `reveal` method', () => {
			expect(noop.reveal).to.exist
			expect(noop.reveal).to.be.a('function')
		})

		it('should have a `sync` method', () => {
			expect(noop.sync).to.exist
			expect(noop.sync).to.be.a('function')
		})

		it('should have a `watch` method', () => {
			expect(noop.watch).to.exist
			expect(noop.watch).to.be.a('function')
		})

		it('should support method chaining', () => {
			expect(noop.remove().reveal().sync().watch()).to.equal(noop)
		})
	})
})
