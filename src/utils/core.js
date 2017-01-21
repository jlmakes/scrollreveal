import { isNode, isNodeList } from '../utils/browser'


export function isElementVisible (element) {
	const container = this.store.containers[element.containerId]
	const viewFactor = element.config.viewFactor
	const viewOffset = element.config.viewOffset

	return isElementInBounds() || element.styles.position === 'fixed'

	function isElementInBounds () {

		/**
		 * Define the element's active boundaries using its view factor.
		 */
		const activeElementBounds = {
			top: element.geometry.bounds.top + element.geometry.height * viewFactor,
			right: element.geometry.bounds.right - element.geometry.width * viewFactor,
			bottom: element.geometry.bounds.bottom - element.geometry.height * viewFactor,
			left: element.geometry.bounds.left + element.geometry.width * viewFactor,
		}

		/**
		 * Define the container's active boundaries using its view offset,
		 * and current scroll position.
		 */
		const activeContainerBounds = {
			top: container.geometry.bounds.top + container.scroll.top + viewOffset.top,
			right: container.geometry.bounds.right + container.scroll.left + viewOffset.right,
			bottom: container.geometry.bounds.bottom + container.scroll.top + viewOffset.bottom,
			left: container.geometry.bounds.left + container.scroll.left + viewOffset.left,
		}

		return activeElementBounds.top < activeContainerBounds.bottom
			&& activeElementBounds.right > activeContainerBounds.left
			&& activeElementBounds.bottom > activeContainerBounds.top
			&& activeElementBounds.left < activeContainerBounds.right
	}
}


export function getGeometry (target, isContainer) {
	/**
	 * We want to ignore padding and scrollbars for container elements.
	 * More information here: https://goo.gl/vOZpbz
	 */
	const height = (isContainer) ? target.node.clientHeight : target.node.offsetHeight
	const width = (isContainer) ? target.node.clientWidth : target.node.offsetWidth

	let offsetTop = 0
	let offsetLeft = 0
	let node = target.node

	do {
		if (!isNaN(node.offsetTop)) {
			offsetTop += node.offsetTop
		}
		if (!isNaN(node.offsetLeft)) {
			offsetLeft += node.offsetLeft
		}
		node = node.offsetParent
	} while (node)

	return {
		bounds: {
			top: offsetTop,
			right: offsetLeft + width,
			bottom: offsetTop + height,
			left: offsetLeft,
		},
		height,
		width,
	}
}


export function getNode (target, container = document) {
	let node = null
	if (typeof target === 'string') {
		try {
			node = container.querySelector(target)
			if (!node) logger(`Querying the selector "${target}" returned nothing.`)
		} catch (err) {
			logger(`"${target}" is not a valid selector.`)
		}
	}
	return isNode(target) ? target : node
}


export function getNodes (target, container = document) {
	if (isNode(target)) return [target]
	if (isNodeList(target)) return Array.prototype.slice.call(target)
	if (typeof target === 'string') {
		try {
			const query = container.querySelectorAll(target)
			const nodes = Array.prototype.slice.call(query)
			if (nodes.length) return nodes
			logger(`Querying the selector "${target}" returned nothing.`)
		} catch (error) {
			logger(`"${target}" is not a valid selector.`)
		}
	}
	return []
}


export function getScrolled (container) {
	return (container.node === document.documentElement)
		? {
			top: window.pageYOffset,
			left: window.pageXOffset,
		} : {
			top: container.node.scrollTop,
			left: container.node.scrollLeft,
		}
}


export function logger (message, ...details) {
	if (console) {
		let report = `ScrollReveal: ${message}`
		details.forEach(detail => report += `\n  - ${detail}`)
		console.log(report) // eslint-disable-line no-console
	}
}
