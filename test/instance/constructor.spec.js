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

		it('should add `height: 100%` to `<body>` element', done => {
			document.body.style.height = 'auto'
			ScrollReveal()
			setTimeout(() => {
				const result = document.body.style.height === '100%'
				expect(result).to.be.true
				done()
			}, 0)
		})

		it('should return a noop instance when not supported', () => {
			const stubs = [
				sinon.stub(console, 'log'),
				sinon.stub(ScrollReveal, 'isSupported'),
			]
			const sr = ScrollReveal()
			stubs.forEach(stub => stub.restore())
			expect(sr.noop).to.be.true
		})

		it('should return a noop instance when container is invalid', () => {
			const stub = sinon.stub(console, 'log')
			const sr = ScrollReveal({ container: null })
			stub.restore()
			expect(sr.noop).to.be.true
		})

		it('should return a noop instance when passed non-object options', () => {
			const stub = sinon.stub(console, 'log')
			const sr1 = ScrollReveal(null)
			const sr2 = ScrollReveal('foo')
			stub.restore()
			expect(sr1.noop).to.be.true
			expect(sr2.noop).to.be.true
		})

		it('should return a singleton', () => {
			const A = ScrollReveal()
			const B = ScrollReveal()
			expect(A === B).to.be.true
		})

		it('should not update the defaults when re-invoked with invalid options', () => {
			ScrollReveal({ duration: 1000 })
			ScrollReveal(null)
			expect(ScrollReveal().defaults.duration).to.equal(1000)
		})

		it('should update the defaults when re-invoked with valid options', () => {
			ScrollReveal({ duration: 1000 })
			ScrollReveal({ duration: 5000 })
			expect(ScrollReveal().defaults.duration).to.equal(5000)
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

		it('should have a `debug` property', () => {
			expect(sr.debug).to.exist
			expect(sr.debug).to.be.a('boolean')
		})

		it('should have a `debug` property', () => {
			expect(sr.debug).to.exist
			expect(sr.debug).to.be.a('boolean')
		})

		it('should only accept boolean values for `debug` property', () => {
			sr.debug = null
			expect(sr.debug).to.exist
			expect(sr.debug).to.be.a('boolean')
			sr.debug = true
			expect(sr.debug).to.be.true
		})

		it('should have a `delegate` property', () => {
			expect(sr.delegate).to.exist
			expect(sr.delegate).to.be.a('function')
		})

		it('should have a `version` property', () => {
			expect(sr.version).to.exist
			expect(sr.version).to.be.equal(version)
		})

		it('should have a `noop` property set to `false`', () => {
			expect(sr.noop).to.exist
			expect(sr.noop).to.be.false
		})
	})

	describe('Non-operational Instance', () => {

		const stubs = [
			sinon.stub(console, 'log'),
			sinon.stub(ScrollReveal, 'isSupported'),
		]
		const sr = ScrollReveal()
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
