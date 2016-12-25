import { isMobile, isNode, isNodeList, transformSupported, transitionSupported } from '../../src/utils/browser'


describe('Browser Utilities', () => {

	describe('isMobile()', () => {

		it('should return true when passed a mobile user agent', () => {

			const android = `Mozilla/5.0 (Linux; U; Android 4.2; en-us;
				Android SDK built for x86 Build/JOP40C) AppleWebKit/534.30
				(KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`

			const iPhone = `Mozilla/5.0 (iPhone; CPU iPhone OS 10_10_5 like Mac OS X)
				AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B411 Safari/600.1.4`

			expect(isMobile(android)).to.be.true
			expect(isMobile(iPhone)).to.be.true
		})

		it('should return false when passed a desktop user agent', () => {

			const chrome = `Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36
				(KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36`

			const firefox = `Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1;
				WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET4.0C; .NET4.0E)`

			expect(isMobile(chrome)).to.be.false
			expect(isMobile(firefox)).to.be.false
		})

		it('should work when not passed an explicit user agent', () => {
			expect(isMobile()).to.be.a('boolean')
		})
	})

	describe('isNode()', () => {

		it('should return true when passed a DOM node', () => {
			const result = isNode(document.querySelector('body'))
			expect(result).to.be.true
		})

		it('should return false when passed HTML as a string', () => {
			const result = isNode('<div class="foo"></div>')
			expect(result).to.be.false
		})
	})

	describe('isNodeList()', () => {

		it('should return true when passed a DOM node list', () => {
			const result = isNodeList(document.querySelectorAll('script'))
			expect(result).to.be.true
		})

		it('should return false when passed an array of HTML elements', () => {
			const elements = document.querySelectorAll('body')
			const result = isNodeList(Array.prototype.slice.call(elements))
			expect(result).to.be.false
		})
	})

	describe('transformSupported()', () => {
		it('should return true', () => {
			expect(transformSupported()).to.be.true
		})
	})

	describe('transitionSupported()', () => {
		it('should return true', () => {
			expect(transitionSupported()).to.be.true
		})
	})
})
