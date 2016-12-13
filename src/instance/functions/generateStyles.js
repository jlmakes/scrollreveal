import matrix from '../../utils/matrix';

export default function generateStyles (element) {
	const computed = window.getComputedStyle(element.node);

	const opacity = {
		computed: computed.opacity,
		generated: element.config.opacity,
	};

	let transform;

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
	if (transform.computed) {
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
	}

	return {
		opacity,
		transform,
	};
}
