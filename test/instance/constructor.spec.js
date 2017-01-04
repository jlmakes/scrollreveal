import ScrollReveal from '../../src/instance/constructor'

describe('ScrollReveal', () => {

	describe('Constructor', () => {

		it('should return a new instance with `new` keyword', () => {
			const result = new ScrollReveal()
			expect(result).to.exist
		})

		it('should return a new instance without `new` keyword', () => {
			const result = ScrollReveal()
			expect(result).to.exist
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
			const result = new ScrollReveal().noop
			stubs.forEach(stub => stub.restore())
			expect(result).to.be.true
		})

		it('should return a noop instance when container is invalid', () => {
			const stub = sinon.stub(console, 'log')
			const result = new ScrollReveal({ container: null }).noop
			stub.restore()
			expect(result).to.be.true
		})

		it('should return a noop instance when passed non-object options', () => {
			const stub = sinon.stub(console, 'log')
			const result1 = new ScrollReveal(null).noop
			const result2 = new ScrollReveal('foo').noop
			stub.restore()
			expect(result1).to.be.true
			expect(result2).to.be.true
		})
	})

	describe('Instance', () => {

		const sr = new ScrollReveal()

		it('should have a `remove` method', () => {
			const result = sr.remove
			expect(result).to.exist
			expect(result).to.be.a('function')
		})

		it('should have a `reveal` method', () => {
			const result = sr.reveal
			expect(result).to.exist
			expect(result).to.be.a('function')
		})

		it('should have a `sync` method', () => {
			const result = sr.sync
			expect(result).to.exist
			expect(result).to.be.a('function')
		})

		it('should have a `watch` method', () => {
			const result = sr.watch
			expect(result).to.exist
			expect(result).to.be.a('function')
		})

		it('should support method chaining', () => {
			const stub = sinon.stub(console, 'log')
			expect(sr.remove().reveal().sync().watch()).to.equal(sr)
			stub.restore()
		})
	})

	describe('Non-operational Instance', () => {

		const stubs = [
			sinon.stub(console, 'log'),
			sinon.stub(ScrollReveal, 'isSupported'),
		]
		const noop = new ScrollReveal()
		stubs.forEach(stub => stub.restore())

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
