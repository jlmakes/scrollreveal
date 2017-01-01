export default function generateStyles (element) {
	const computed = window.getComputedStyle(element.node)
	const config = element.config

	const inlineRegex = /(.+);*$/g
	const inlineStyle = element.node.getAttribute('style')
	const inlineMatch = inlineRegex.exec(inlineStyle)[1]

	const inline = {
		computed: inlineMatch,
		generated: (inlineMatch)
			? `${inlineMatch}; visibility: visible;`
			: 'visibility: visible;',
	}

	let opacity
	if (config.opacity < 1) {
		opacity = {
			computed: parseFloat(computed.opacity),
			generated: parseFloat(config.opacity),
		}
	}

	return {
		inline,
		opacity,
	}
}
