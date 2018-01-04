import deepAssign from '../../src/utils/deep-assign'

describe('Utilities', () => {
	describe('deepAssign()', () => {
		it('should assign source values to target object', () => {
			const target = { foo: 'bar', bun: 'baz' }
			const source = { foo: 'bonk!', bif: 'baff' }
			const goal = { foo: 'bonk!', bun: 'baz', bif: 'baff' }
			deepAssign(target, source)
			expect(target).to.deep.equal(goal)
		})

		it('should assign nested source values to target object', () => {
			// each property tests a
			// different execution path
			const target = {
				foo: 'initial',
				bar: 'initial',
				kel: { pow: 'pop' },
				zad: null
			}
			const source = {
				foo: 'bonk!',
				bar: { baz: 'baff' },
				kel: { pow: 'lol' },
				zad: { min: 'max' }
			}
			const goal = {
				foo: 'bonk!',
				bar: { baz: 'baff' },
				kel: { pow: 'lol' },
				zad: { min: 'max' }
			}
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
})
