import $ from 'tealight'
import each from '../../utils/each'

export default function rinse() {
	const struct = () => ({
		active: [],
		stale: []
	})

	const elementIds = struct()
	const sequenceIds = struct()
	const containerIds = struct()

	/**
	 * Take stock of active element IDs.
	 */
	try {
		each($('[data-sr-id]'), node => {
			const id = parseInt(node.getAttribute('data-sr-id'))
			elementIds.active.push(id)
		})
	} catch (e) {
		throw e
	}
	/**
	 * Destroy stale elements.
	 */
	each(this.store.elements, element => {
		if (elementIds.active.indexOf(element.id) === -1) {
			elementIds.stale.push(element.id)
		}
	})

	each(elementIds.stale, staleId => delete this.store.elements[staleId])

	/**
	 * Take stock of active container and sequence IDs.
	 */
	each(this.store.elements, element => {
		if (containerIds.active.indexOf(element.containerId) === -1) {
			containerIds.active.push(element.containerId)
		}
		if (element.hasOwnProperty('sequence')) {
			if (sequenceIds.active.indexOf(element.sequence.id) === -1) {
				sequenceIds.active.push(element.sequence.id)
			}
		}
	})

	/**
	 * Destroy stale containers.
	 */
	each(this.store.containers, container => {
		if (containerIds.active.indexOf(container.id) === -1) {
			containerIds.stale.push(container.id)
		}
	})

	each(containerIds.stale, staleId => {
		const stale = this.store.containers[staleId].node
		stale.removeEventListener('scroll', this.delegate)
		stale.removeEventListener('resize', this.delegate)
		delete this.store.containers[staleId]
	})

	/**
	 * Destroy stale sequences.
	 */
	each(this.store.sequences, sequence => {
		if (sequenceIds.active.indexOf(sequence.id) === -1) {
			sequenceIds.stale.push(sequence.id)
		}
	})

	each(sequenceIds.stale, staleId => delete this.store.sequences[staleId])
}
