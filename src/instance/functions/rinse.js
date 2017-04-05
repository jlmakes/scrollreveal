import { each } from '../../utils/generic'
import { getNodes } from '../../utils/core'

export default function rinse () {

	const elementIds = {
		active: [],
		stale: [],
	}

	const containerIds = {
		active: [],
		stale: [],
	}

	const sequenceIds = {
		active: [],
		stale: [],
	}

	/**
	 * Take stock of active element IDs.
	 */
	each(getNodes('[data-sr-id]'), node => {
		const id = parseInt(node.getAttribute('data-sr-id'))
		elementIds.active.push(id)
	})

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
		this.store.containers[staleId].node.removeEventListener('scroll', this.delegate)
		this.store.containers[staleId].node.removeEventListener('resize', this.delegate)
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
