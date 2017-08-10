import clean from '../methods/clean'
import style from '../functions/style'
import initialize from '../functions/initialize'
import { Sequence } from '../functions/sequence'

import { getNode, getNodes, logger } from '../../utils/core'
import { deepAssign, each, nextUniqueId } from '../../utils/generic'
import { isMobile } from '../../utils/browser'

export default function reveal (target, options, interval, sync) {

	const containers = this.store.containers

	/**
	 * The reveal method has an optional 2nd parameter,
	 * so here we just shuffle things around to accept
	 * the interval being passed as the 2nd argument.
	 */
	if (typeof options === 'number') {
		interval = parseInt(options)
		options = {}
	} else {
		interval = parseInt(interval)
		options = options || {}
	}

	/**
	 * To start things off, build element collection,
	 * and attempt to instantiate a new sequence.
	 */
	let nodes
	let sequence
	try {
		nodes = getNodes(target)
		sequence = interval ? new Sequence(interval) : null
	} catch (e) {
		return logger.call(this, 'Reveal failed.', e.stack || e.message)
	}

	/**
	 * Begin element set-up...
	 */
	let config
	let container
	let containerId
	try {
		const elements = nodes.reduce((buffer, node) => {
			const element = {}
			const existingId = node.getAttribute('data-sr-id')

			if (existingId) {
				deepAssign(element, this.store.elements[existingId])

				/**
				 * In order to prevent previously generated styles
				 * from throwing off the new styles, the style tag
				 * has to be reverted to it's pre-reveal state.
				 */
				element.node.setAttribute('style', element.styles.inline)

			} else {
				element.id = nextUniqueId()
				element.node = node
				element.seen = false
				element.revealed = false
				element.visible = false
			}

			config = deepAssign({}, element.config || this.defaults, options)

			/**
			* Verify the current device passes our platform configuration,
			* and cache the result for the rest of the loop.
			*/
			let disabled
			{
				if (disabled == null) {
					disabled = !config.mobile && isMobile() || !config.desktop && !isMobile()
				}
				if (disabled) {
					if (existingId) {
						clean.call(this, element)
					}
					return buffer
				}
			}

			container = getNode(config.container)
			{
				if (!container) {
					throw new Error('Invalid container.')
				}
				if (!container.contains(node)) {
					return buffer // skip elements found outside the container
				}
				if (containerId == null) {
					each(containers, storedContainer => {
						if (!containerId && storedContainer.node === container) {
							containerId = storedContainer.id
						}
					})
					if (isNaN(containerId)) {
						containerId = nextUniqueId()
					}
				}
			}

			element.config = config
			element.containerId = containerId
			element.styles = style(element)

			if (sequence) {
				element.sequence = {
					id: sequence.id,
					index: sequence.members.length,
				}
				sequence.members.push(element.id)
			}

			buffer.push(element)
			return buffer
		}, [])

		/**
		* Modifying the DOM via setAttribute needs to be handled
		* separately from reading computed styles in the map above
		* for the browser to batch DOM changes (limiting reflows)
		*/
		each(elements, element => {
			this.store.elements[element.id] = element
			element.node.setAttribute('data-sr-id', element.id)
		})

	} catch (e) {
		return logger.call(this, 'Reveal failed.', e.stack || e.message)
	}

	/**
	 * Now that element set-up is complete...
	 *
	 * Let’s commit the current container and any
	 * sequence data we have to the store.
	 */
	{
		containers[containerId] = containers[containerId] || {
			id: containerId,
			node: container,
		}
		if (sequence) {
			this.store.sequences[sequence.id] = sequence
		}
	}

	/**
	* If reveal wasn't invoked by sync, we want to
	* make sure to add this call to the history.
	*/
	if (!sync) {
		this.store.history.push({ target, options, interval })

		/**
		* Push initialization to the event queue, giving
		* multiple reveal calls time to be interpretted.
		*/
		if (this.initTimeout) {
			window.clearTimeout(this.initTimeout)
		}
		this.initTimeout = window.setTimeout(initialize.bind(this), 0)
	}
}
