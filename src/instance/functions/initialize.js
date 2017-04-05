import { each } from '../../utils/generic'
import rinse from './rinse'


export default function initialize () {

	rinse.call(this)

	each(this.store.elements, element => {
		let styles = [element.styles.inline]

		if (element.visible) {
			styles.push(element.styles.opacity.computed)
			styles.push(element.styles.transform.generated.final)
		} else {
			styles.push(element.styles.opacity.generated)
			styles.push(element.styles.transform.generated.initial)
		}

		element.node.setAttribute('style', styles.join(' '))
	})

	each(this.store.containers, container => {
		if (container.node === document.documentElement) {
			window.addEventListener('scroll', this.delegate)
			window.addEventListener('resize', this.delegate)
		} else {
			container.node.addEventListener('scroll', this.delegate)
			container.node.addEventListener('resize', this.delegate)
		}
	})

	/**
	 * Manually invoke delegate once to capture
	 * element and container dimensions, container
	 * scroll position, and trigger any valid reveals
	 */
	this.delegate()

	this.initTimeout = null
}
