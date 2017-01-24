import { each } from '../../utils/generic'


export default function initialize () {

	const activeContainerIds = []
	const activeSequenceIds = []

	each(this.store.elements, element => {
		if (activeContainerIds.indexOf(element.containerId) === -1) {
			activeContainerIds.push(element.containerId)
		}
		if (activeSequenceIds.indexOf(element.sequence.id) === -1) {
			activeSequenceIds.push(element.sequence.id)
		}

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
			container.node.removeEventListener('scroll', this.delegate)
			container.node.removeEventListener('resize', this.delegate)
			delete this.store.containers[container.id]

		/**
		 * Bind event listeners
		 */
		} else if (container.node === document.documentElement) {
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
