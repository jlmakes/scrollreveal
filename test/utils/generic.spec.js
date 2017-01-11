import { deepAssign, isObject, each, nextUniqueId } from '../../src/utils/generic'


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
			let caught
			try {
				deepAssign(null, null)
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceof(TypeError)
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

		it('should return false when passed undefined', () => {
			const result = isObject(undefined)
			expect(result).to.be.false
		})
	})

	describe('each()', () => {

		function Fixture () {
			this.foo = 'bar'
			this.baz = 'bun'
		}

		describe('when passed an object literal', () => {

			it('invokes callback for each property', () => {
				const fixture = new Fixture()
				const spy = sinon.spy()
				each(fixture, spy)
				expect(spy).to.have.been.calledTwice
			})

			it('ignores properties on the prototype chain', () => {
				Fixture.prototype.biff = 'baff'
				const fixture = new Fixture()
				const spy = sinon.spy()
				each(fixture, spy)
				expect(spy).to.have.been.calledTwice
			})

			it('passes the value, key and collection to the callback', () => {
				const fixture = new Fixture()
				let _value, _key, _collection
				each(fixture, (value, key, collection) => {
					_value = value
					_key = key
					_collection = collection
				})
				expect(_value).to.equal('bun')
				expect(_key).to.equal('baz')
				expect(_collection).to.deep.equal(fixture)
			})

		})

		describe('when passed an array', () => {

			const fixture = ['apple', 'orange', 'banana']

			it('invokes callback for each value', () => {
				const spy = sinon.spy()
				each(fixture, spy)
				expect(spy).to.have.been.calledThrice
			})

			it('passes the value, index and collection to the callback', () => {
				let _value, _index, _collection
				each(fixture, (value, index, collection) => {
					_value = value
					_index = index
					_collection = collection
				})
				expect(_value).to.equal('banana')
				expect(_index).to.equal(2)
				expect(_collection).to.deep.equal(fixture)
			})
		})

		describe('otherwise', () => {
			it('should throw a type error when passed an invalid collection', () => {
				let caught
				try {
					each(null, () => {})
				} catch (error) {
					caught = error
				}
				expect(caught).to.exist
				expect(caught).to.be.an.instanceof(TypeError)
			})
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
