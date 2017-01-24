import delegate from './delegate'
import { each } from '../../utils/generic'


export default function initialize () {

	/**
	 * Let's take stock of which containers and sequences
	 * our current store of elements is actively using,
	 * and add each elements initial styles.
	 */
	const activeContainerIds = []
	const activeSequenceIds = []

	each(this.store.elements, element => {
		if (activeContainerIds.indexOf(element.containerId) === -1) {
			activeContainerIds.push(element.containerId)
		}
		if (activeSequenceIds.indexOf(element.sequence.id) === -1) {
			activeSequenceIds.push(element.sequence.id)
		}

		/**
		 * Since we may be initializing elements that have
		 * already been revealed, e.g. invoking sync(),
		 * discern whether to use initial or final styles.
		 */
		let styles

		if (element.visible) {
			styles = [
				element.styles.inline,
				element.styles.opacity.computed,
				element.styles.transform.generated.final,
			].join(' ')
		} else {
			styles = [
				element.styles.inline,
				element.styles.opacity.generated,
				element.styles.transform.generated.initial,
			].join(' ')
		}

		element.node.setAttribute('style', styles)
	})

	/**
	 * Remove unused sequences.
	 */
	each(this.store.sequences, sequence => {
		if (activeSequenceIds.indexOf(sequence.id) === -1) {
			delete this.store.sequences[sequence.id]
		}
	})

	each(this.store.containers, container => {

		/**
		 * Remove unused containers.
		 */
		if (activeContainerIds.indexOf(container.id) === -1) {
			container.node.removeEventListener('scroll', delegate)
			container.node.removeEventListener('resize', delegate)
			delete this.store.containers[container.id]

		/**
		 * The default container is the <html> element, and in
		 * this case we listen for scroll events on the window.
		 */
		} else if (container.node === document.documentElement) {
			window.addEventListener('scroll', delegate.bind(this))
			window.addEventListener('resize', delegate.bind(this))

		/**
		 * Otherwise listen for scroll events directly on the container.
		 */
		} else {
			container.node.addEventListener('scroll', delegate.bind(this))
			container.node.addEventListener('resize', delegate.bind(this))
		}
	})

	/**
	 * Manually invoke delegate once to capture
	 * element and container dimensions, container
	 * scroll position, and trigger any valid reveals
	 */
	delegate.call(this)

	/**
	 * And with that, initialization is complete so
	 * let's update our initialization timeout and state.
	 */
	this.initTimeout = null
	this.initialized = true
}
