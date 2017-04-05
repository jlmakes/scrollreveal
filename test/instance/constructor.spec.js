import ScrollReveal from '../../src/instance/constructor'
import { version } from '../../package.json'

describe('ScrollReveal', () => {

	describe('Constructor', () => {

		it('should return a new instance with `new` keyword', () => {
			const sr = new ScrollReveal()
			expect(sr).to.exist
		})

		it('should return a new instance without `new` keyword', () => {
			const sr = ScrollReveal()
			expect(sr).to.exist
		})

		it('should add the class `sr` to `<html>` element', () => {
			document.documentElement.classList.remove('sr')
			ScrollReveal()
			const result = document.documentElement.classList.contains('sr')
			expect(result).to.be.true
		})

		it('should return a noop instance when not supported', () => {
			const stubs = [
				sinon.stub(console, 'log'),
				sinon.stub(ScrollReveal, 'isSupported'),
			]
			const sr = new ScrollReveal()
			stubs.forEach(stub => stub.restore())
			expect(sr.noop).to.be.true
		})

		it('should return a noop instance when container is invalid', () => {
			const stub = sinon.stub(console, 'log')
			const sr = new ScrollReveal({ container: null })
			stub.restore()
			expect(sr.noop).to.be.true
		})

		it('should return a noop instance when passed non-object options', () => {
			const stub = sinon.stub(console, 'log')
			const sr1 = new ScrollReveal(null)
			const sr2 = new ScrollReveal('foo')
			stub.restore()
			expect(sr1.noop).to.be.true
			expect(sr2.noop).to.be.true
		})
	})

	describe('Instance', () => {

		const sr = new ScrollReveal()

		it('should have a `clean` method', () => {
			expect(sr.clean).to.exist
			expect(sr.clean).to.be.a('function')
		})

		it('should have a `destroy` method', () => {
			expect(sr.destroy).to.exist
			expect(sr.destroy).to.be.a('function')
		})

		it('should have a `reveal` method', () => {
			expect(sr.reveal).to.exist
			expect(sr.reveal).to.be.a('function')
		})

		it('should have a `sync` method', () => {
			expect(sr.sync).to.exist
			expect(sr.sync).to.be.a('function')
		})

		it('should have a `noop` property set to `false`', () => {
			expect(sr.noop).to.exist
			expect(sr.noop).to.be.false
		})

		it('should have a `version` property', () => {
			expect(sr.version).to.exist
			expect(sr.version).to.be.equal(version)
		})
	})

	describe('Non-operational Instance', () => {

		const stubs = [
			sinon.stub(console, 'log'),
			sinon.stub(ScrollReveal, 'isSupported'),
		]
		const sr = new ScrollReveal()
		stubs.forEach(stub => stub.restore())

		it('should have a `clean` method', () => {
			expect(sr.clean).to.exist
			expect(sr.clean).to.be.a('function')
		})

		it('should have a `destroy` method', () => {
			expect(sr.destroy).to.exist
			expect(sr.destroy).to.be.a('function')
		})

		it('should have a `reveal` method', () => {
			expect(sr.reveal).to.exist
			expect(sr.reveal).to.be.a('function')
		})

		it('should have a `sync` method', () => {
			expect(sr.sync).to.exist
			expect(sr.sync).to.be.a('function')
		})

		it('should have a `noop` property set to `true`', () => {
			expect(sr.noop).to.exist
			expect(sr.noop).to.be.true
		})
	})
})
