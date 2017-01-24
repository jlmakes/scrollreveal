import * as matrix from 'redpill'
import { getPrefixedStyleProperty } from '../../utils/browser'


export default function style (element) {
	const computed = window.getComputedStyle(element.node)
	const position = computed.position
	const config = element.config

	const inlineRegex = /.+[^;]/g
	const inlineStyle = element.node.getAttribute('style') || ''
	const inlineMatch = inlineRegex.exec(inlineStyle)
	const inline = (inlineMatch) ? `${inlineMatch[0]}; visibility: visible;` : 'visibility: visible;'

	const computedOpacity = parseFloat(computed.opacity)
	const configOpacity = parseFloat(config.opacity)
	const opacity = {
		computed: (computedOpacity !== configOpacity) ? `opacity: ${computedOpacity}; ` : '',
		generated: (computedOpacity !== configOpacity) ? `opacity: ${configOpacity}; ` : '',
	}

	const transformations = []

	if (parseFloat(config.distance)) {
		const axis = (config.origin === 'top' || config.origin === 'bottom') ? 'Y' : 'X'

		/**
		 * Let’s make sure our our pixel distances are negative for top and left.
		 * e.g. { origin: 'top', distance: '25px' } starts at `top: -25px` in CSS.
    	 */
		let distance = config.distance
		if (config.origin === 'top' || config.origin === 'left') {
			distance = /^-/.test(distance)
				? distance.substr(1)
				: `-${distance}`
		}

		const [value, unit] = distance.match(/(^-?\d+\.?\d?)|(em$|px$|\%$)/g)

		switch (unit) {
			case 'em':
				distance = parseInt(computed.fontSize) * value
				break
			case 'px':
				distance = value
				break
			case '%':
				distance = (axis === 'Y')
					? element.node.getBoundingClientRect().height * value / 100
					: element.node.getBoundingClientRect().width * value / 100
				break
			default:
				throw new RangeError('Unrecognized or missing distance unit.')
		}

		transformations.push(matrix[`translate${axis}`](distance))
	}

	if (config.rotate.x) transformations.push(matrix.rotateX(config.rotate.x))
	if (config.rotate.y) transformations.push(matrix.rotateY(config.rotate.y))
	if (config.rotate.z) transformations.push(matrix.rotateZ(config.rotate.z))
	if (config.scale !== 1) transformations.push(matrix.scale(config.scale))

	let transform
	if (transformations.length) {

		const transformProperty = getPrefixedStyleProperty('transform')
		transform = {
			computed: {
				raw: computed[transformProperty],
			},
			property: transformProperty,
		}

		/**
		* The default computed transform value should be one of:
		* undefined || 'none' || 'matrix()' || 'matrix3d()'
		*/
		if (transform.computed.raw === 'none') {
			transform.computed.matrix = matrix.identity()
		} else {
			const match = transform.computed.raw.match(/\(([^)]+)\)/)
			if (match) {
				const values = match[1].split(', ').map(value => parseFloat(value))
				transform.computed.matrix = matrix.format(values)
			} else {
				throw new RangeError('Unrecognized computed transform property value.')
			}
		}

		transformations.unshift(transform.computed.matrix)
		const product = transformations.reduce((m, x) => matrix.multiply(m, x))

		transform.generated = {
			initial: `${transform.property}: matrix3d(${product.join(', ')});`,
			final: `${transform.property}: matrix3d(${transform.computed.matrix.join(', ')});`,
		}
	}

	let transition
	if (opacity.generated || transform.generated) {

		const transitionProperty = getPrefixedStyleProperty('transition')
		transition = {
			computed: computed[transitionProperty],
			fragments: [],
			property: transitionProperty,
		}

		const { delay, duration, easing } = config

		if (opacity) {
			transition.fragments.push({
				delayed: `opacity ${duration / 1000}s ${easing} ${delay / 1000}s`,
				instant: `opacity ${duration / 1000}s ${easing} 0s`,
			})
		}

		if (transform) {
			transition.fragments.push({
				delayed: `${transform.property} ${duration / 1000}s ${easing} ${delay / 1000}s`,
				instant: `${transform.property} ${duration / 1000}s ${easing} 0s`,
			})
		}

		/**
		 * The default computed transition property should be one of:
		 * undefined || '' || 'all 0s ease 0s' || 'all 0s 0s cubic-bezier()'
		 */
		if (transition.computed && !transition.computed.match(/all 0s/)) {
			transition.fragments.unshift({
				delayed: transition.computed,
				instant: transition.computed,
			})
		}

		const composed = transition.fragments.reduce((composition, fragment, i) => {
			composition.delayed += (i === 0) ? fragment.delayed : `, ${fragment.delayed}`
			composition.instant += (i === 0) ? fragment.instant : `, ${fragment.instant}`
			return composition
		}, {
			delayed: '',
			instant: '',
		})

		transition.generated = {
			delayed: `${transition.property}: ${composed.delayed};`,
			instant: `${transition.property}: ${composed.instant};`,
		}
	}

	return {
		inline,
		opacity,
		position,
		transform,
		transition,
	}
}
