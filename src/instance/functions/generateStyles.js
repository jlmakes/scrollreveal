import matrix from '../../utils/matrix';


export default function generateStyles (element) {
	const computed = window.getComputedStyle(element.node);
	const config = element.config;
	const transformations = [];

	let opacity;
	let transform;
	let transition;

	if (config.opacity < 1) {
		opacity = {
			computed: computed.opacity,
			generated: config.opacity,
		};
	}

	if (parseFloat(config.distance)) {
		const axis = (config.origin === 'top' || config.origin === 'bottom') ? 'Y' : 'X';

		let distance = config.distance;

		/**
		 * Let’s make sure our our pixel distances are negative for top and left.
		 * e.g. { origin: 'top', distance: '25px' } starts at `top: -25px` in CSS.
    	 */
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
				distance = (axis == 'Y')
					? element.node.offsetHeight * value / 100
					: element.node.offsetWidth * value / 100;
				break;
			default:
				throw new Error('Unrecognized or missing distance unit.');
		}

		transformations.push(matrix[`translate${axis}`](distance));
	}

	if (config.rotate.x) transformations.push(matrix.rotateX(config.rotate.x));
	if (config.rotate.y) transformations.push(matrix.rotateY(config.rotate.y));
	if (config.rotate.z) transformations.push(matrix.rotateZ(config.rotate.z));
	if (config.scale !== 1) transformations.push(matrix.scale(config.scale));

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
		} else throw new Error('Missing computed transform property.');

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
			} else throw new Error('Unrecognized computed transform property value.');
		}
	}

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
				computed: computed.transition,
				prefixed: false,
			};
		} else if (typeof computed.webkitTransition === 'string') {
			transition = {
				computed: computed.webkitTransition,
				prefixed: true,
			};
		} else throw new Error('Missing computed transition property.');
	}

	return {
		opacity,
		transform,
		transition,
	};
}
