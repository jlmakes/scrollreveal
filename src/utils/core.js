import { isNode, isNodeList } from '../utils/browser'


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


export function logger (message) {
	if (console) console.log(`ScrollReveal: ${message}`) // eslint-disable-line no-console
}
