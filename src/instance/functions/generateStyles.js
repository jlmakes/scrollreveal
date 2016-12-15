import matrix from '../../utils/matrix';


export default function generateStyles (element) {
	const computed = window.getComputedStyle(element.node);
	const config = element.config;
	const transformations = [];

	let opacity;
	let transform;

	/**
	 * We want to generate (and use) as few styles as
	 * possible, so we go through a series of checks
	 * to determine which styles our config needs.
	 */
	if (config.opacity < 1) {
		opacity = {
			computed: computed.opacity,
			generated: config.opacity,
		};
	}

	if (parseFloat(config.distance)) {
		const axis = (config.origin === 'top' || config.origin === 'bottom') ? 'Y' : 'X';
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
		 *
		 * So we first go through looking for strings, and mark
		 * whether or not it was found on the prefixed property.
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
		}

		/**
		 * The transformation matrix as mentioned above, can come
		 * in two flavors: 'matrix3d()' with 16 values, and the
		 * shorthand version 'matrix()' with 6 values.
		 *
		 * If we get a `matrix3d()`, we just save its 16 values,
		 * but if we get the shorthand `matrix()`, we must convert
		 * its 6 values into the full 16 value representation.
		 *
		 * Guidelines for conversion: https://goo.gl/EJlUQ1
		 */
		if (transform.computed.raw !== 'none') {
			const match = transform.computed.raw.match(/\(([^)]+)\)/);
			if (match) {
				let values = match[1].split(', ').map(value => parseFloat(value));
				if (values.length === 16) {
					transform.computed.matrix = values;
				} else {
					transform.computed.matrix = matrix.identity();
					transform.computed.matrix[0] = values[0];
					transform.computed.matrix[1] = values[1];
					transform.computed.matrix[4] = values[2];
					transform.computed.matrix[5] = values[3];
					transform.computed.matrix[12] = values[4];
					transform.computed.matrix[13] = values[5];
				}
			}
		} else transform.computed.matrix = matrix.identity();
	}

	transformations.unshift(transform.computed.matrix);
	const generated = transformations.reduce((m, x) => matrix.multiply(m, x));

	transform.generated = {
		initial: (transform.prefixed)
			? `-webkit-transform: matrix3d(${generated.join(', ')})`
			: `transform: matrix3d(${generated.join(', ')})`,
		final: (transform.prefixed)
			? `-webkit-transform: matrix3d(${transform.computed.matrix.join(', ')})`
			: `transform: matrix3d(${transform.computed.matrix.join(', ')})`,
	};

	return {
		opacity,
		transform,
	};
}
