import each from '../../utils/each'
import rinse from './rinse'

export default function initialize() {
	rinse.call(this)

	each(this.store.elements, element => {
		let styles = [element.styles.inline.generated]

		if (element.visible) {
			styles.push(element.styles.opacity.computed)
			styles.push(element.styles.transform.generated.final)
			element.revealed = true
		} else {
			styles.push(element.styles.opacity.generated)
			styles.push(element.styles.transform.generated.initial)
			element.revealed = false
		}

		element.node.setAttribute('style', styles.filter(s => s !== '').join(' '))
	})

	each(this.store.containers, container => {
		const target =
			container.node === document.documentElement ? window : container.node
		target.addEventListener('scroll', this.delegate, { passive:true })
		target.addEventListener('resize', this.delegate)
	})

	/**
	 * Manually invoke delegate once to capture
	 * element and container dimensions, container
	 * scroll position, and trigger any valid reveals
	 */
	this.delegate()

	/**
	 * Wipe any existing `setTimeout` now
	 * that initialization has completed.
	 */
	this.initTimeout = null
}
