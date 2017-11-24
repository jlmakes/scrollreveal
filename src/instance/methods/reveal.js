import clean from '../methods/clean'
import style from '../functions/style'
import initialize from '../functions/initialize'
import { Sequence } from '../functions/sequence'

import { deepAssign, each, getNode, getNodes } from 'tealight'
import { logger } from '../../utils/core'
import { nextUniqueId } from '../../utils/generic'
import { isMobile } from '../../utils/browser'

export default function reveal (target, options, interval, sync) {
	const containerBuffer = []

	/**
	 * The reveal method has optional 2nd and 3rd parameters,
	 * so we first explicitly check what was passed in.
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
	try {
		const elements = nodes.reduce((elementBuffer, elementNode) => {
			const element = {}
			const existingId = elementNode.getAttribute('data-sr-id')

			if (existingId) {
				deepAssign(element, this.store.elements[existingId])

				/**
				 * In order to prevent previously generated styles
				 * from throwing off the new styles, the style tag
				 * has to be reverted to it's pre-reveal state.
				 */
				element.node.setAttribute('style', element.styles.inline.computed)
			} else {
				element.id = nextUniqueId()
				element.node = elementNode
				element.seen = false
				element.revealed = false
				element.visible = false
			}

			const config = deepAssign({}, element.config || this.defaults, options)

			/**
			 * Verify the current device passes our platform configuration,
			 * and cache the result for the rest of the loop.
			 */
			let disabled
			{
				if (disabled == null) {
					disabled = (!config.mobile && isMobile()) || (!config.desktop && !isMobile())
				}
				if (disabled) {
					if (existingId) {
						clean.call(this, element)
					}
					return elementBuffer
				}
			}

			const containerNode = getNode(config.container)

			let containerId
			{
				if (!containerNode) {
					throw new Error('Invalid container.')
				}
				if (!containerNode.contains(elementNode)) {
					return elementBuffer // skip elements found outside the container
				}

				containerId = getContainerId(containerNode, containerBuffer, this.store.containers)

				if (containerId == null) {
					containerId = nextUniqueId()
					containerBuffer.push({ id: containerId, node: containerNode })
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

			elementBuffer.push(element)
			return elementBuffer
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
	 * Let’s commit any container and sequence data we have to the store.
	 */
	{
		each(containerBuffer, container => {
			this.store.containers[container.id] = {
				id: container.id,
				node: container.node,
			}
		})
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
		 * multiple reveal calls time to be interpreted.
		 */
		if (this.initTimeout) {
			window.clearTimeout(this.initTimeout)
		}
		this.initTimeout = window.setTimeout(initialize.bind(this), 0)
	}
}

function getContainerId (node, ...collections) {
	let id = null
	each(collections, collection => {
		each(collection, container => {
			if (id === null && container.node === node) {
				id = container.id
			}
		})
	})
	return id
}
