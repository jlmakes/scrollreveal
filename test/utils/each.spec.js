import each from '../../src/utils/each'

describe('Utilities', () => {
	describe('each()', () => {
		function Fixture () {
			this.foo = 'bar'
			this.baz = 'bun'
		}

		describe('if passed an object literal...', () => {
			it('should invoke callback for each property', () => {
				const fixture = new Fixture()
				const spy = sinon.spy()
				each(fixture, spy)
				expect(spy).to.have.been.calledTwice
			})

			it('should ignore properties on the prototype chain', () => {
				Fixture.prototype.biff = 'baff'
				const fixture = new Fixture()
				const spy = sinon.spy()
				each(fixture, spy)
				expect(spy).to.have.been.calledTwice
			})

			it('should pass the value, key and collection to the callback', () => {
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

		describe('if passed an array...', () => {
			const fixture = ['apple', 'orange', 'banana']

			it('should invoke callback for each value', () => {
				const spy = sinon.spy()
				each(fixture, spy)
				expect(spy).to.have.been.calledThrice
			})

			it('should pass the value, index and collection to the callback', () => {
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

		describe('else', () => {
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
})
