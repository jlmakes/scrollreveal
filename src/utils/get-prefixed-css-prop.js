const getPrefixedCssProp = (() => {
	let properties = {}
	const style = document.documentElement.style

	function getPrefixedCssProperty(name, source = style) {
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

	getPrefixedCssProperty.clearCache = () => (properties = {})

	return getPrefixedCssProperty
})()

export default getPrefixedCssProp
