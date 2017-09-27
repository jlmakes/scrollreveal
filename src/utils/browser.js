export const getPrefixedStyleProperty = (() => {
	let properties = {}
	const style = document.documentElement.style

	function getPrefixedStyleProperty (name, source = style) {
		if (name && typeof name === 'string') {
			if (properties[name]) {
				return properties[name]
			}
			if (typeof source[name] === 'string') {
				return (properties[name] = name)
			}
			if (typeof source[`-webkit-${name}`] === 'string') {
				return (properties[name] = `-webkit-${name}`)
			}
			throw new RangeError(`Unable to find "${name}" style property.`)
		}
		throw new TypeError('Expected a string.')
	}

	getPrefixedStyleProperty.clearCache = () => (properties = {})

	return getPrefixedStyleProperty
})()

export function isMobile (agent = navigator.userAgent) {
	return /Android|iPhone|iPad|iPod/i.test(agent)
}

export function isNode (target) {
	return typeof window.Node === 'object'
		? target instanceof window.Node
		: target !== null &&
			typeof target === 'object' &&
			typeof target.nodeType === 'number' &&
			typeof target.nodeName === 'string'
}

export function isNodeList (target) {
	const prototypeToString = Object.prototype.toString.call(target)
	const regex = /^\[object (HTMLCollection|NodeList|Object)\]$/

	return typeof window.NodeList === 'object'
		? target instanceof window.NodeList
		: typeof target === 'object' &&
			typeof target.length === 'number' &&
			regex.test(prototypeToString) &&
			(target.length === 0 || isNode(target[0]))
}

export function transformSupported () {
	const style = document.documentElement.style
	return 'transform' in style || 'WebkitTransform' in style
}

export function transitionSupported () {
	const style = document.documentElement.style
	return 'transition' in style || 'WebkitTransition' in style
}
