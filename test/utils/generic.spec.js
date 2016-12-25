import { deepAssign, deepEqual, isObject, forOwn, nextUniqueId } from '../../src/utils/generic'


describe('Generic Utilities', () => {

	describe('deepAssign()', () => {

		it('should assign source values to target object', () => {
			const target = { foo: 'bar', bun: 'baz' }
			const source = { foo: 'bonk!', bif: 'baff' }
			const goal = { foo: 'bonk!', bun: 'baz', bif: 'baff' }
			deepAssign(target, source)
			expect(target).to.deep.equal(goal)
		})

		it('should assign nested source values to target object', () => {
			const target = { foo: 'bar', bun: { baz: 'tan' } }
			const source = { foo: 'bonk!', bun: { baz: 'baff', pew: 'pow' } }
			const goal = { foo: 'bonk!', bun: { baz: 'baff', pew: 'pow' } }
			deepAssign(target, source)
			expect(target).to.deep.equal(goal)
		})

		it('should accept multiple sources', () => {
			const target = { foo: 'bar', bun: 'baz' }
			const source1 = { foo: 'bonk!', bif: 'baff' }
			const source2 = { foo: 'pow!' }
			const goal = { foo: 'pow!', bun: 'baz', bif: 'baff' }
			deepAssign(target, source1, source2)
			expect(target).to.deep.equal(goal)
		})

		it('should throw a type error when not passed an object literal', () => {
			try {
				deepAssign(null, null)
			} catch (error) {
				expect(error).to.be.an.instanceof(TypeError)
			}
		})
	})

	describe('deepEqual()', () => {

		it('should return true when passed like nested objects', () => {
			const first = { foo: 'bar', bun: { baz: 10 } }
			const second = { foo: 'bar', bun: { baz: 10 } }
			const result = deepEqual(first, second)
			expect(result).to.be.true
		})

		it('should return false when strict comparison fails', () => {
			const first = { foo: 'bar', bun: { baz: 10 } }
			const second = { foo: 'bar', bun: { baz: '10' } }
			const result = deepEqual(first, second)
			expect(result).to.be.false
		})

		it('should return false when passed unlike nested objects', () => {
			const first = { foo: 'bar', bam: 'wonk!', bun: { baz: 'biff!' } }
			const second = { foo: 'bar', bam: 'pow!', bun: { baz: 'biff!' } }
			const result = deepEqual(first, second)
			expect(result).to.be.false
		})
	})

	describe('isObject()', () => {

		it('should return true when passed an object literal', () => {
			const result = isObject({})
			expect(result).to.be.true
		})

		it('should return false when passed a function', () => {
			const result = isObject(() => {})
			expect(result).to.be.false
		})

		it('should return false when passed an array', () => {
			const result = isObject([])
			expect(result).to.be.false
		})

		it('should return false when passed null', () => {
			const result = isObject(null)
			expect(result).to.be.false
		})
	})

	describe('forOwn()', () => {

		function Fixture () {
			this.foo = 'bar'
			this.baz = 'bun'
		}

		it('should invoke callback for each property', () => {
			let fixture = new Fixture()
			const spy = sinon.spy()
			forOwn(fixture, spy)
			expect(spy).to.have.been.calledTwice
		})

		it('should ignore properties on the prototype chain', () => {
			Fixture.prototype.biff = 'baff'
			let fixture = new Fixture()
			const spy = sinon.spy()
			forOwn(fixture, spy)
			expect(spy).to.have.been.calledTwice
		})

		it('should throw a type error when not passed an object literal', () => {
			try {
				forOwn(null, () => {})
			} catch (error) {
				expect(error).to.be.an.instanceof(TypeError)
			}
		})
	})

	describe('nextUniqueId()', () => {

		it('should start at 0', () => {
			const result = nextUniqueId()
			expect(result).to.equal(0)
		})

		it('should increment by 1', () => {
			const result = nextUniqueId()
			expect(result).to.equal(1)
		})

		it('should return a number', () => {
			const result = nextUniqueId()
			expect(result).to.be.a('number')
		})
	})
})
