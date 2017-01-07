import * as browser from '../../src/utils/browser'


describe('Browser Utilities', () => {

	describe('getPrefixedStyleProperty()', () => {

		beforeEach('clear cache', () => {
			browser.getPrefixedStyleProperty.clearCache()
		})

		it('should return unprefixed properties before prefixed', () => {
			const source = {
				transform: '',
				'-webkit-transform': '',
			}
			const result = browser.getPrefixedStyleProperty('transform', source)
			expect(result).to.equal('transform')
		})

		it('should return prefixed property names', () => {
			const source = { '-webkit-transform': '' }
			const result = browser.getPrefixedStyleProperty('transform', source)
			expect(result).to.equal('-webkit-transform')
		})

		it('should return property names from cache when available', () => {
			const source = { '-webkit-transform': '' }
			browser.getPrefixedStyleProperty('transform', source)
			const result = browser.getPrefixedStyleProperty('transform', {})
			expect(result).to.equal('-webkit-transform')
		})

		it('should throw a range error when no property is found', () => {
			let caught
			try {
				browser.getPrefixedStyleProperty('transform', {})
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceof(RangeError)
		})

		it('should throw a type error if not passed a string', () => {
			let caught
			try {
				browser.getPrefixedStyleProperty(null)
			} catch (error) {
				caught = error
			}
			expect(caught).to.exist
			expect(caught).to.be.an.instanceof(TypeError)
		})
	})

	describe('isMobile()', () => {

		it('should return true when passed a mobile user agent', () => {

			const android = `Mozilla/5.0 (Linux; U; Android 4.2; en-us;
				Android SDK built for x86 Build/JOP40C) AppleWebKit/534.30
				(KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`

			const iPhone = `Mozilla/5.0 (iPhone; CPU iPhone OS 10_10_5 like Mac OS X)
				AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B411 Safari/600.1.4`

			expect(browser.isMobile(android)).to.be.true
			expect(browser.isMobile(iPhone)).to.be.true
		})

		it('should return false when passed a desktop user agent', () => {

			const chrome = `Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36
				(KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36`

			const firefox = 'Mozilla/5.0 (X11; Linux i686; rv:45.0) Gecko/20100101 Firefox/45.0'

			const ie10 = `Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1;
				WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET4.0C; .NET4.0E)`

			expect(browser.isMobile(chrome)).to.be.false
			expect(browser.isMobile(firefox)).to.be.false
			expect(browser.isMobile(ie10)).to.be.false
		})

		it('should work when not passed an explicit user agent', () => {
			expect(browser.isMobile()).to.be.a('boolean')
		})
	})

	describe('isNode()', () => {

		it('should return true when passed a DOM node', () => {
			const result = browser.isNode(document.querySelector('body'))
			expect(result).to.be.true
		})

		it('should return false when passed HTML as a string', () => {
			const result = browser.isNode('<div class="foo"></div>')
			expect(result).to.be.false
		})
	})

	describe('isNodeList()', () => {

		it('should return true when passed a DOM node list', () => {
			const result = browser.isNodeList(document.querySelectorAll('script'))
			expect(result).to.be.true
		})

		it('should return false when passed an array of HTML elements', () => {
			const elements = document.querySelectorAll('body')
			const result = browser.isNodeList(Array.prototype.slice.call(elements))
			expect(result).to.be.false
		})
	})

	describe('transformSupported()', () => {
		it('should return true', () => {
			expect(browser.transformSupported()).to.be.true
		})
	})

	describe('transitionSupported()', () => {
		it('should return true', () => {
			expect(browser.transitionSupported()).to.be.true
		})
	})
})
