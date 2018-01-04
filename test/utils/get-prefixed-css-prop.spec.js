import getPrefixedCssProp from '../../src/utils/get-prefixed-css-prop'

describe('Utilities', () => {
	describe('getPrefixedCssProp()', () => {
		beforeEach('clear cache', () => {
			getPrefixedCssProp.clearCache()
		})

		it('should return unprefixed properties before prefixed', () => {
			const source = {
				transform: '',
				'-webkit-transform': '',
			}
			const result = getPrefixedCssProp('transform', source)
			expect(result).to.equal('transform')
		})

		it('should return prefixed property names', () => {
			const source = { '-webkit-transform': '' }
			const result = getPrefixedCssProp('transform', source)
			expect(result).to.equal('-webkit-transform')
		})

		it('should return property names from cache when available', () => {
			const source = { '-webkit-transform': '' }
			getPrefixedCssProp('transform', source)
			const result = getPrefixedCssProp('transform', {})
			expect(result).to.equal('-webkit-transform')
		})

		it('should throw a range error when no property is found', () => {
			let caught
			try {
				getPrefixedCssProp('transform', {})
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceof(RangeError)
		})

		it('should throw a type error if not passed a string', () => {
			let caught
			try {
				getPrefixedCssProp(null)
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceof(TypeError)
		})
	})
})
