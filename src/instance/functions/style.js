import {
	parse,
	multiply,
	rotateX,
	rotateY,
	rotateZ,
	scale,
	translateX,
	translateY,
} from 'rematrix'

import { getPrefixedStyleProperty } from '../../utils/browser'


export default function style (element) {
	const computed = window.getComputedStyle(element.node)
	const position = computed.position
	const config = element.config

	/**
	 * Generate inline styles
	 */
	const inlineRegex = /.+[^;]/g
	const inlineStyle = element.node.getAttribute('style') || ''
	const inlineMatch = inlineRegex.exec(inlineStyle)

	let inline = (inlineMatch) ? `${inlineMatch[0]};` : ''
	if (inline.indexOf('visibility: visible') === -1) {
		inline += (inline.length) ? ' ' : ''
		inline += 'visibility: visible;'
	}

	/**
	 * Generate opacity styles
	 */
	const computedOpacity = parseFloat(computed.opacity)
	const configOpacity = (!isNaN(parseFloat(config.opacity)))
		? parseFloat(config.opacity)
		: parseFloat(computed.opacity)

	const opacity = {
		computed: (computedOpacity !== configOpacity)
			? `opacity: ${computedOpacity};`
			: '',
		generated: (computedOpacity !== configOpacity)
			? `opacity: ${configOpacity};`
			: '',
	}

	/**
	 * Generate transformation styles
	 */
	const transformations = []

	if (parseFloat(config.distance)) {
		const axis = (config.origin === 'top' || config.origin === 'bottom') ? 'Y' : 'X'

		/**
		 * Let’s make sure our our pixel distances are negative for top and left.
		 * e.g. { origin: 'top', distance: '25px' } starts at `top: -25px` in CSS.
    	 */
		let distance = config.distance
		if (config.origin === 'top' || config.origin === 'left') {
			distance = (/^-/.test(distance))
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
				/**
				 * Here we use `getBoundingClientRect` instead of
				 * the existing data attached to `element.geometry`
				 * because only the former includes any transformations
				 * current applied to the element.
				 *
				 * If that behavior ends up being unintuitive, this
				 * logic could instead utilize `element.geometry.height`
				 * and `element.geoemetry.width` for the distaince calculation
				 */
				distance = (axis === 'Y')
					? element.node.getBoundingClientRect().height * value / 100
					: element.node.getBoundingClientRect().width * value / 100
				break
			default:
				throw new RangeError('Unrecognized or missing distance unit.')
		}

		if (axis === 'Y') {
			transformations.push(translateY(distance))
		} else {
			transformations.push(translateX(distance))
		}
	}

	if (config.rotate.x) transformations.push(rotateX(config.rotate.x))
	if (config.rotate.y) transformations.push(rotateY(config.rotate.y))
	if (config.rotate.z) transformations.push(rotateZ(config.rotate.z))
	if (config.scale !== 1) {
		if (config.scale === 0) {
			/**
			 * The CSS Transforms matrix interpolation specification
			 * basically disallows transitions of non-invertible
			 * matrixes, which means browsers won't transition
			 * elements with zero scale.
			 *
			 * That’s inconvenient for the API and developer
			 * experience, so we simply nudge their value
			 * slightly above zero; this allows browsers
			 * to transition our element as expected.
			 *
			 * `0.0002` was the smallest number
			 * that performed across browsers.
			 */
			transformations.push(scale(0.0002))
		} else {
			transformations.push(scale(config.scale))
		}
	}

	const transform = {}
	if (transformations.length) {

		transform.property = getPrefixedStyleProperty('transform')
		/**
		* The default computed transform value should be one of:
		* undefined || 'none' || 'matrix()' || 'matrix3d()'
		*/
		transform.computed = {
			raw: computed[transform.property],
			matrix: parse(computed[transform.property]),
		}

		transformations.unshift(transform.computed.matrix)
		const product = transformations.reduce(multiply)

		transform.generated = {
			initial: `${transform.property}: matrix3d(${product.join(', ')});`,
			final: `${transform.property}: matrix3d(${transform.computed.matrix.join(', ')});`,
		}
	} else {
		transform.generated = {
			initial: '',
			final: '',
		}
	}

	/**
	 * Generate transition styles
	 */
	let transition = {}
	if (opacity.generated || transform.generated.initial) {

		transition.property = getPrefixedStyleProperty('transition')
		transition.computed = computed[transition.property]
		transition.fragments = []

		const { delay, duration, easing } = config

		if (opacity.generated) {
			transition.fragments.push({
				delayed: `opacity ${duration / 1000}s ${easing} ${delay / 1000}s`,
				instant: `opacity ${duration / 1000}s ${easing} 0s`,
			})
		}

		if (transform.generated.initial) {
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
	} else {
		transition.generated = {
			delayed: '',
			instant: '',
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
