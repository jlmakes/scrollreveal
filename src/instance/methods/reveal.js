import { getNode, getNodes, logger } from '../../utils/core'
import { deepAssign, each, nextUniqueId } from '../../utils/generic'
import style from '../functions/style'
import initialize from '../functions/initialize'


export default function reveal (target, options, interval, sync) {

	/**
	 * The reveal method has an optional 2nd parameter,
	 * so here we just shuffle things around to accept
	 * the interval being passed as the 2nd argument.
	 */
	if (typeof options === 'number') {
		interval = parseInt(options)
		options = {}
	} else {
		options = options || {}
	}

	const containers = this.store.containers
	const container = getNode(options.container || this.defaults.container)
	const targets = getNodes(target, container)

	if (!targets.length) {
		logger('Reveal cannot be performed on 0 elements.')
		return this
	}

	/**
	 * Sequence intervals must be at least 16ms (60fps)
	 * but can be negative for sequencing in reverse.
	 */
	let sequence
	if (typeof interval === 'number' && Math.abs(interval) > 15) {
		const sequenceId = nextUniqueId()
		sequence = this.store.sequences[sequenceId] = {
			elementIds: [],
			firstActiveIndex: 0,
			id: sequenceId,
			interval,
			lastActiveIndex: 0,
		}
	}

	let containerId
	each(containers, (storedContainer, id) => {
		if (storedContainer.node === container) {
			containerId = parseInt(id)
		}
	})

	if (containerId === undefined) {
		containerId = nextUniqueId()
	}

	try {
		const elements = targets.map(node => {
			const element = {}
			const existingId = node.getAttribute('data-sr-id')

			if (existingId) {
				deepAssign(element, this.store.elements[existingId])
			} else {
				deepAssign(element, {
					id: nextUniqueId(),
					config: {},
					node,
				})
			}

			/**
			 * Both existing elements and new elements
			 * need a reference to the latest container.
			 */
			element.containerId = containerId

			if (sequence) {
				element.sequence = {
					id: sequence.id,
					index: sequence.elementIds.length,
				}
				sequence.elementIds.push(element.id)
			}

			element.config = deepAssign({}, this.defaults, element.config, options)
			element.styles = style(element)

			return element
		})

		/**
		* Modifying the DOM via setAttribute needs to be handled
		* separately from reading computed styles in the map above
		* for the browser to batch DOM changes (limiting reflows)
		*/
		each(elements, element => {
			this.store.elements[element.id] = element
			element.node.setAttribute('data-sr-id', element.id)
		})

	} catch (error) {
		logger(error.message)
		return this
	}

	if (!containers[containerId]) {
		containers[containerId] = { node: container }
	}

	/**
	* If reveal wasn't invoked by sync, we want to make
	* sure to add this call to the history.
	*/
	if (!sync) {
		this.store.history.push({ target, options, interval })

		/**
		* Push initialization to the event queue, giving chained
		* reveal calls time to be interpretted.
		*/
		if (this.initTimeout) {
			window.clearTimeout(this.initTimeout)
		}
		this.initTimeout = window.setTimeout(initialize.bind(this), 0)
	}

	return this
}
