import matrix from '../../utils/matrix';


export default function generateStyles (element) {
	const computed = window.getComputedStyle(element.node);
	const config = element.config;

	/**
	 * We'll either end up with `null` or a string of the
	 * inline styles (without any trailing semi-colon).
	 */
	const inlineRegex = /(.+[^;]);?$/g;
	const inlineStyle = element.node.getAttribute('style');
	const inlineMatch = inlineRegex.exec(inlineStyle)[1];

	const inline = {
		computed: inlineMatch,
		generated: (inlineMatch)
			? `${inlineMatch}; visibility: visible;`
			: 'visibility: visible;',
	};

	/**
	 * From here, we progressively build up the
	 * necessary styles by comparing configuration
	 * against noop values.
	 *
	 * In this instance, if the configured opacity
	 * is 1, then no opacity transition is needed.
	 */
	let opacity;
	if (config.opacity < 1) {
		opacity = {
			computed: parseFloat(computed.opacity),
			generated: parseFloat(config.opacity),
		};
	}

	/**
	 * The next phase is building up this array
	 * with all necessary transforms styles.
	 */
	const transformations = [];

	if (config.rotate.x) transformations.push(matrix.rotateX(config.rotate.x));
	if (config.rotate.y) transformations.push(matrix.rotateY(config.rotate.y));
	if (config.rotate.z) transformations.push(matrix.rotateZ(config.rotate.z));
	if (config.scale !== 1) transformations.push(matrix.scale(config.scale));

	/**
	 * Distance requires a little extra work in order to parse the unit
	 * type, and convert it to pixels for the transformation matrix.
	 */
	if (parseFloat(config.distance)) {
		const axis = (config.origin === 'top' || config.origin === 'bottom') ? 'Y' : 'X';

		/**
		 * Let’s make sure our our pixel distances are negative for top and left.
		 * e.g. { origin: 'top', distance: '25px' } starts at `top: -25px` in CSS.
    	 */
		let distance = config.distance;
		if (config.origin === 'top' || config.origin === 'left') {
			distance = /^-/.test(distance)
				? distance.substr(1)
				: `-${distance}`;
		}

		const [value, unit] = distance.match(/(^-?\d+\.?\d?)|(em$|px$|\%$)/g);

		switch (unit) {
			case 'em':
				distance = parseInt(computed.fontSize) * value;
				break;
			case 'px':
				distance = value;
				break;
			case '%':
				distance = (axis === 'Y')
					? element.node.getBoundingClientRect().height * value / 100
					: element.node.getBoundingClientRect().width * value / 100;
				break;
			default:
				throw new RangeError('Unrecognized or missing distance unit.');
		}

		transformations.push(matrix[`translate${axis}`](distance));
	}

	/**
	 * If any transformations have been stored, we have to
	 * capture any existing transformations, to add them to
	 * our collection before reducing it.
	 */
	let transform;
	if (transformations.length) {
		/**
		 * The computed transform property should be one of:
		 *
		 *  - undefined
		 *  - 'none'
		 *  - 'matrix()'
		 *  - 'matrix3d()'
		 */
		if (typeof computed.transform === 'string') {
			transform = {
				computed: {
					raw: computed.transform,
				},
				prefixed: false,
			};
		} else if (typeof computed.webkitTransform === 'string') {
			transform = {
				computed: {
					raw: computed.webkitTransform,
				},
				prefixed: true,
			};
		} else {
			throw new Error('Missing computed transform property.');
		}

		if (transform.computed.raw === 'none') {
			transform.computed.matrix = matrix.identity();
		} else {
			/**
			 * If we get a `matrix3d()`, we just save its 16 values,
			 * but if we get the shorthand `matrix()`, we must convert
			 * its 6 values into the full 16 value representation.
			 */
			const match = transform.computed.raw.match(/\(([^)]+)\)/);
			if (match) {
				let values = match[1].split(', ').map(value => parseFloat(value));
				if (values.length === 16) {
					transform.computed.matrix = values;
				} else {
					/**
					 * Conversion Guide: https://goo.gl/EJlUQ1
					 */
					transform.computed.matrix = matrix.identity();
					transform.computed.matrix[0] = values[0];
					transform.computed.matrix[1] = values[1];
					transform.computed.matrix[4] = values[2];
					transform.computed.matrix[5] = values[3];
					transform.computed.matrix[12] = values[4];
					transform.computed.matrix[13] = values[5];
				}
			} else {
				throw new RangeError('Unrecognized computed transform property value.');
			}
		}

		/**
		 * We push either a transformation matrix identity,
		 * or the computed transform styles, and reduce our
		 * collection into the final generated transformations.
		 */
		transformations.unshift(transform.computed.matrix);
		const sum = transformations.reduce((m, x) => matrix.multiply(m, x));

		transform.generated = {
			initial: (transform.prefixed)
				? `-webkit-transform: matrix3d(${sum.join(', ')})`
				: `transform: matrix3d(${sum.join(', ')})`,
			final: (transform.prefixed)
				? `-webkit-transform: matrix3d(${transform.computed.matrix.join(', ')})`
				: `transform: matrix3d(${transform.computed.matrix.join(', ')})`,
		};
	}

	/**
	 * The final step is to generate transition styles for whatever
	 * opacity or transform styles we've generated thus far, which
	 * similar to transforms, requires we start by capturing the
	 * existing transition styles to preserve as much as possible.
	 */
	let transition;
	if (opacity || transform) {
		/**
		 * The default computed transition property should be one of:
		 *
		 *  - undefined
		 *  - ''
		 *  - 'all 0s ease 0s'
		 *  - 'all 0s 0s cubic-bezier()'
		 */
		if (typeof computed.transition === 'string') {
			transition = {
				fragments: [],
				computed: computed.transition,
				prefixed: false,
			};
		} else if (typeof computed.webkitTransition === 'string') {
			transition = {
				fragments: [],
				computed: computed.webkitTransition,
				prefixed: true,
			};
		} else {
			throw new Error('Missing computed transition property.');
		}

	}

	/**
	 * We have everything in place to generate style fragments
	 * for each transition required by our configuration.
	 *
	 * Note: ScrollReveal ignores user-specified delay for reset
	 * animations and various `option.delayType` values, so we
	 * need to generate both a delayed and instant variation of
	 * our transition styles.
	 */
	if (transition) {
		let { delay, duration, easing } = config;

		if (opacity) {
			transition.fragments.push({
				delayed: `opacity ${duration / 1000}s ${easing} ${delay / 1000}s`,
				instant: `opacity ${duration / 1000}s ${easing} 0s`,
			});
		}

		if (transform) {
			transition.fragments.push({
				delayed: (transform.prefixed)
					? `-webkit-transform ${duration / 1000}s ${easing} ${delay / 1000}s`
					: `transform ${duration / 1000}s ${easing} ${delay / 1000}s`,
				instant: (transform.prefixed)
					? `-webkit-transform ${duration / 1000}s ${easing} 0s`
					: `transform ${duration / 1000}s ${easing} 0s`,
			});
		}

		/**
		 * If we find a computed transition that doesn't match the defaults,
		 * let's insert it at the beginning of our transition fragments to
		 * ensure we preserve as many styles as possible.
		 */
		if (transition.computed && !transition.computed.match(/all 0s/)) {
			transition.fragments.unshift({
				delayed: transition.computed,
				instant: transition.computed,
			});
		}

		/**
		 * Finally, we can combined all of our transition style
		 * fragments into the final strings that will serve as the
		 * property values for our generated transition styles.
		 */
		const composed = {
			delayed: '',
			instant: '',
		};

		transition.fragments.reduce((composition, fragment, i) => {
			composition.delayed += (i === 0) ? fragment.delayed : `, ${fragment.delayed}`;
			composition.instant += (i === 0) ? fragment.instant : `, ${fragment.instant}`;
			return composition;
		}, composed);

		transition.generated = {
			delayed: (transition.prefixed)
				? `-webkit-transition: ${composed.delayed}`
				: `transition: ${composed.delayed}`,
			instant: (transition.prefixed)
				? `-webkit-transition: ${composed.instant}`
				: `transition: ${composed.instant}`,
		};
	}

	return {
		inline,
		opacity,
		transform,
		transition,
	};
}
