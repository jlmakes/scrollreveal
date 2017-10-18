/*! @license ScrollReveal v4.0.0-beta.19

	Copyright 2017 Fisssion LLC.

	Licensed under the GNU General Public License 3.0 for
	compatible open source projects and non-commercial use.

	For commercial sites, themes, projects, and applications,
	keep your source code private/proprietary by purchasing
	a commercial license from https://scrollrevealjs.org/
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ScrollReveal = factory());
}(this, (function () { 'use strict';

var defaults = {
	delay: 0,
	distance: '0',
	duration: 600,
	easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',
	opacity: 0,
	origin: 'bottom',
	rotate: {
		x: 0,
		y: 0,
		z: 0,
	},
	scale: 1,
	container: document.documentElement,
	desktop: true,
	mobile: true,
	reset: false,
	useDelay: 'always',
	viewFactor: 0.0,
	viewOffset: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	afterReset: function afterReset () {},
	afterReveal: function afterReveal () {},
	beforeReset: function beforeReset () {},
	beforeReveal: function beforeReveal () {},
};

var noop = {
	clean: function clean () {},
	destroy: function destroy () {},
	reveal: function reveal () {},
	sync: function sync () {},
	get noop () {
		return true
	},
};

function deepAssign (target) {
	var sources = [], len = arguments.length - 1;
	while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

	if (isObject(target)) {
		each(sources, function (source) {
			each(source, function (data, key) {
				if (isObject(data)) {
					if (!target[key] || !isObject(target[key])) {
						target[key] = {};
					}
					deepAssign(target[key], data);
				} else {
					target[key] = data;
				}
			});
		});
		return target
	} else {
		throw new TypeError('Expected an object literal.')
	}
}

function isObject (object) {
	return (
		object !== null &&
		typeof object === 'object' &&
		(object.constructor === Object ||
			Object.prototype.toString.call(object) === '[object Object]')
	)
}

function each (collection, callback) {
	if (isObject(collection)) {
		var keys = Object.keys(collection);
		for (var i = 0; i < keys.length; i++) {
			callback(collection[keys[i]], keys[i], collection);
		}
	} else if (Array.isArray(collection)) {
		for (var i$1 = 0; i$1 < collection.length; i$1++) {
			callback(collection[i$1], i$1, collection);
		}
	} else {
		throw new TypeError('Expected either an array or object literal.')
	}
}

var nextUniqueId = (function () {
	var uid = 0;
	return function () { return uid++; }
})();

var getPrefixedStyleProperty = (function () {
	var properties = {};
	var style = document.documentElement.style;

	function getPrefixedStyleProperty (name, source) {
		if ( source === void 0 ) source = style;

		if (name && typeof name === 'string') {
			if (properties[name]) {
				return properties[name]
			}
			if (typeof source[name] === 'string') {
				return (properties[name] = name)
			}
			if (typeof source[("-webkit-" + name)] === 'string') {
				return (properties[name] = "-webkit-" + name)
			}
			throw new RangeError(("Unable to find \"" + name + "\" style property."))
		}
		throw new TypeError('Expected a string.')
	}

	getPrefixedStyleProperty.clearCache = function () { return (properties = {}); };

	return getPrefixedStyleProperty
})();

function isMobile (agent) {
	if ( agent === void 0 ) agent = navigator.userAgent;

	return /Android|iPhone|iPad|iPod/i.test(agent)
}

function isNode (target) {
	return typeof window.Node === 'object'
		? target instanceof window.Node
		: target !== null &&
			typeof target === 'object' &&
			typeof target.nodeType === 'number' &&
			typeof target.nodeName === 'string'
}

function isNodeList (target) {
	var prototypeToString = Object.prototype.toString.call(target);
	var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/;

	return typeof window.NodeList === 'object'
		? target instanceof window.NodeList
		: typeof target === 'object' &&
			typeof target.length === 'number' &&
			regex.test(prototypeToString) &&
			(target.length === 0 || isNode(target[0]))
}

function transformSupported () {
	var style = document.documentElement.style;
	return 'transform' in style || 'WebkitTransform' in style
}

function transitionSupported () {
	var style = document.documentElement.style;
	return 'transition' in style || 'WebkitTransition' in style
}

function isElementVisible (element) {
	var container = this.store.containers[element.containerId];
	var viewFactor = Math.max(0, Math.min(1, element.config.viewFactor));
	var viewOffset = element.config.viewOffset;

	var elementBounds = {
		top: element.geometry.bounds.top + element.geometry.height * viewFactor,
		right: element.geometry.bounds.right - element.geometry.width * viewFactor,
		bottom: element.geometry.bounds.bottom - element.geometry.height * viewFactor,
		left: element.geometry.bounds.left + element.geometry.width * viewFactor,
	};

	var containerBounds = {
		top: container.geometry.bounds.top + container.scroll.top + viewOffset.top,
		right: container.geometry.bounds.right + container.scroll.left - viewOffset.right,
		bottom: container.geometry.bounds.bottom + container.scroll.top - viewOffset.bottom,
		left: container.geometry.bounds.left + container.scroll.left + viewOffset.left,
	};

	return (
		(elementBounds.top < containerBounds.bottom &&
			elementBounds.right > containerBounds.left &&
			elementBounds.bottom > containerBounds.top &&
			elementBounds.left < containerBounds.right) ||
		element.styles.position === 'fixed'
	)
}

function getGeometry (target, isContainer) {
	/**
	 * We want to ignore padding and scrollbars for container elements.
	 * More information here: https://goo.gl/vOZpbz
	 */
	var height = isContainer ? target.node.clientHeight : target.node.offsetHeight;
	var width = isContainer ? target.node.clientWidth : target.node.offsetWidth;

	var offsetTop = 0;
	var offsetLeft = 0;
	var node = target.node;

	do {
		if (!isNaN(node.offsetTop)) {
			offsetTop += node.offsetTop;
		}
		if (!isNaN(node.offsetLeft)) {
			offsetLeft += node.offsetLeft;
		}
		node = node.offsetParent;
	} while (node)

	return {
		bounds: {
			top: offsetTop,
			right: offsetLeft + width,
			bottom: offsetTop + height,
			left: offsetLeft,
		},
		height: height,
		width: width,
	}
}

function getNode (target, container) {
	if ( container === void 0 ) container = document;

	var node = null;
	if (typeof target === 'string') {
		try {
			node = container.querySelector(target);
		} catch (e) {
			throw new Error(("\"" + target + "\" is not a valid selector."))
		}
		if (!node) {
			throw new Error(("The selector \"" + target + "\" matches 0 elements."))
		}
	}
	return isNode(target) ? target : node
}

function getNodes (target, container) {
	if ( container === void 0 ) container = document;

	if (target instanceof Array) {
		return target
	}
	if (isNode(target)) {
		return [target]
	}
	if (isNodeList(target)) {
		return Array.prototype.slice.call(target)
	}
	if (typeof target === 'string') {
		var query;
		try {
			query = container.querySelectorAll(target);
		} catch (e) {
			throw new Error(("\"" + target + "\" is not a valid selector."))
		}
		return Array.prototype.slice.call(query)
	}
}

function getScrolled (container) {
	return container.node === document.documentElement
		? {
			top: window.pageYOffset,
			left: window.pageXOffset,
		}
		: {
			top: container.node.scrollTop,
			left: container.node.scrollLeft,
		}
}

function logger (message) {
	var details = [], len = arguments.length - 1;
	while ( len-- > 0 ) details[ len ] = arguments[ len + 1 ];

	if (this.constructor.debug && console) {
		var report = "%cScrollReveal: " + message;
		details.forEach(function (detail) { return (report += "\n — " + detail); });
		console.log(report, 'color: #ea654b;'); // eslint-disable-line no-console
	}
}

function rinse () {
	var this$1 = this;

	var elementIds = {
		active: [],
		stale: [],
	};

	var containerIds = {
		active: [],
		stale: [],
	};

	var sequenceIds = {
		active: [],
		stale: [],
	};

	/**
	 * Take stock of active element IDs.
	 */
	try {
		each(getNodes('[data-sr-id]'), function (node) {
			var id = parseInt(node.getAttribute('data-sr-id'));
			elementIds.active.push(id);
		});
	} catch (e) {
		throw e
	}
	/**
	 * Destroy stale elements.
	 */
	each(this.store.elements, function (element) {
		if (elementIds.active.indexOf(element.id) === -1) {
			elementIds.stale.push(element.id);
		}
	});

	each(elementIds.stale, function (staleId) { return delete this$1.store.elements[staleId]; });

	/**
	 * Take stock of active container and sequence IDs.
	 */
	each(this.store.elements, function (element) {
		if (containerIds.active.indexOf(element.containerId) === -1) {
			containerIds.active.push(element.containerId);
		}
		if (element.hasOwnProperty('sequence')) {
			if (sequenceIds.active.indexOf(element.sequence.id) === -1) {
				sequenceIds.active.push(element.sequence.id);
			}
		}
	});

	/**
	 * Destroy stale containers.
	 */
	each(this.store.containers, function (container) {
		if (containerIds.active.indexOf(container.id) === -1) {
			containerIds.stale.push(container.id);
		}
	});

	each(containerIds.stale, function (staleId) {
		this$1.store.containers[staleId].node.removeEventListener('scroll', this$1.delegate);
		this$1.store.containers[staleId].node.removeEventListener('resize', this$1.delegate);
		delete this$1.store.containers[staleId];
	});

	/**
	 * Destroy stale sequences.
	 */
	each(this.store.sequences, function (sequence) {
		if (sequenceIds.active.indexOf(sequence.id) === -1) {
			sequenceIds.stale.push(sequence.id);
		}
	});

	each(sequenceIds.stale, function (staleId) { return delete this$1.store.sequences[staleId]; });
}

function clean (target) {
	var this$1 = this;

	var dirty;
	try {
		each(getNodes(target), function (node) {
			var id = node.getAttribute('data-sr-id');
			if (id !== null) {
				dirty = true;
				node.setAttribute('style', this$1.store.elements[id].styles.inline.generated);
				node.removeAttribute('data-sr-id');
				delete this$1.store.elements[id];
			}
		});
	} catch (e) {
		return logger.call(this, 'Clean failed.', e.stack || e.message)
	}

	if (dirty) {
		try {
			rinse.call(this);
		} catch (e) {
			return logger.call(this, 'Clean failed.', e.stack || e.message)
		}
	}
}

function destroy () {
	var this$1 = this;

	/**
	 * Remove all generated styles and element ids
	 */
	each(this.store.elements, function (element) {
		element.node.setAttribute('style', element.styles.inline);
		element.node.removeAttribute('data-sr-id');
	});

	/**
	 * Remove all event listeners.
	 */
	each(this.store.containers, function (container) {
		if (container.node === document.documentElement) {
			window.removeEventListener('scroll', this$1.delegate);
			window.removeEventListener('resize', this$1.delegate);
		} else {
			container.node.removeEventListener('scroll', this$1.delegate);
			container.node.removeEventListener('resize', this$1.delegate);
		}
	});

	/**
	 * Clear all data from the store
	 */
	this.store = {
		containers: {},
		elements: {},
		history: [],
		sequences: {},
	};
}

/*! @license Rematrix v0.2.1

	Copyright 2017 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
/**
 * @module Rematrix
 */

/**
* Transformation matrices in the browser come in two flavors:
*
*  - `matrix` using 6 values (short)
*  - `matrix3d` using 16 values (long)
*
* This utility follows this [conversion guide](https://goo.gl/EJlUQ1)
* to expand short form matrices to their equivalent long form.
*
* @param  {array} source - Accepts both short and long form matrices.
* @return {array}
*/
function format (source) {
	if (source.constructor !== Array) {
		throw new TypeError('Expected array.')
	}
	if (source.length === 16) {
		return source
	}
	if (source.length === 6) {
		var matrix = identity();
		matrix[0] = source[0];
		matrix[1] = source[1];
		matrix[4] = source[2];
		matrix[5] = source[3];
		matrix[12] = source[4];
		matrix[13] = source[5];
		return matrix
	}
	throw new RangeError('Expected array with either 6 or 16 values.')
}

/**
 * Returns a matrix representing no transformation. The product of any matrix
 * multiplied by the identity matrix will be the original matrix.
 *
 * > **Tip:** Similar to how `5 * 1 === 5`, where `1` is the identity.
 *
 * @return {array}
 */
function identity () {
	var matrix = [];
	for (var i = 0; i < 16; i++) {
		i % 5 == 0 ? matrix.push(1) : matrix.push(0);
	}
	return matrix
}

/**
 * Returns a 4x4 matrix describing the combined transformations
 * of both arguments.
 *
 * > **Note:** Order is very important. For example, rotating 45°
 * along the Z-axis, followed by translating 500 pixels along the
 * Y-axis... is not the same as translating 500 pixels along the
 * Y-axis, followed by rotating 45° along on the Z-axis.
 *
 * @param  {array} m - Accepts both short and long form matrices.
 * @param  {array} x - Accepts both short and long form matrices.
 * @return {array}
 */
function multiply (m, x) {
	var fm = format(m);
	var fx = format(x);
	var product = [];

	for (var i = 0; i < 4; i++) {
		var row = [fm[i], fm[i + 4], fm[i + 8], fm[i + 12]];
		for (var j = 0; j < 4; j++) {
			var k = j * 4;
			var col = [fx[k], fx[k + 1], fx[k + 2], fx[k + 3]];
			var result = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3];

			product[i + k] = result;
		}
	}

	return product
}

/**
 * Attempts to return a 4x4 matrix describing the CSS transform
 * matrix passed in, but will return the identity matrix as a
 * fallback.
 *
 * **Tip:** In virtually all cases, this method is used to convert
 * a CSS matrix (retrieved as a `string` from computed styles) to
 * its equivalent array format.
 *
 * @param  {string} source - String containing a valid CSS `matrix` or `matrix3d` property.
 * @return {array}
 */
function parse (source) {
	if (typeof source === 'string') {
		var match = source.match(/matrix(3d)?\(([^)]+)\)/);
		if (match) {
			var raw = match[2].split(', ').map(parseFloat);
			return format(raw)
		}
	}
	return identity()
}

/**
 * Returns a 4x4 matrix describing X-axis rotation.
 *
 * @param  {number} angle - Measured in degrees.
 * @return {array}
 */
function rotateX (angle) {
	var theta = Math.PI / 180 * angle;
	var matrix = identity();

	matrix[5] = matrix[10] = Math.cos(theta);
	matrix[6] = matrix[9] = Math.sin(theta);
	matrix[9] *= -1;

	return matrix
}

/**
 * Returns a 4x4 matrix describing Y-axis rotation.
 *
 * @param  {number} angle - Measured in degrees.
 * @return {array}
 */
function rotateY (angle) {
	var theta = Math.PI / 180 * angle;
	var matrix = identity();

	matrix[0] = matrix[10] = Math.cos(theta);
	matrix[2] = matrix[8] = Math.sin(theta);
	matrix[2] *= -1;

	return matrix
}

/**
 * Returns a 4x4 matrix describing Z-axis rotation.
 *
 * @param  {number} angle - Measured in degrees.
 * @return {array}
 */
function rotateZ (angle) {
	var theta = Math.PI / 180 * angle;
	var matrix = identity();

	matrix[0] = matrix[5] = Math.cos(theta);
	matrix[1] = matrix[4] = Math.sin(theta);
	matrix[4] *= -1;

	return matrix
}

/**
* Returns a 4x4 matrix describing 2D scaling. The first argument
* is used for both X and Y-axis scaling, unless an optional
* second argument is provided to explicitly define Y-axis scaling.
*
* @param  {number} scalar    - Decimal multiplier.
* @param  {number} [scalarY] - Decimal multiplier.
* @return {array}
*/
function scale (scalar, scalarY) {
	var matrix = identity();

	matrix[0] = scalar;
	matrix[5] = typeof scalarY === 'number' ? scalarY : scalar;

	return matrix
}

/**
 * Returns a 4x4 matrix describing X-axis translation.
 *
 * @param  {number} distance - Measured in pixels.
 * @return {array}
 */
function translateX (distance) {
	var matrix = identity();
	matrix[12] = distance;
	return matrix
}

/**
 * Returns a 4x4 matrix describing Y-axis translation.
 *
 * @param  {number} distance - Measured in pixels.
 * @return {array}
 */
function translateY (distance) {
	var matrix = identity();
	matrix[13] = distance;
	return matrix
}

function style (element) {
	var computed = window.getComputedStyle(element.node);
	var position = computed.position;
	var config = element.config;

	/**
	 * Generate inline styles
	 */
	var inline = {};

	var inlineStyle = element.node.getAttribute('style') || '';
	var inlineMatch = inlineStyle.match(/.+[^;]/g);

	inline.computed = inlineMatch ? inlineMatch[0] : '';

	inline.generated = (inline.computed.indexOf('visibility: visible') === -1)
		? inline.computed + '; visibility: visible;'
		: inline.computed + ';';

	/**
	 * Generate opacity styles
	 */
	var computedOpacity = parseFloat(computed.opacity);
	var configOpacity = !isNaN(parseFloat(config.opacity))
		? parseFloat(config.opacity)
		: parseFloat(computed.opacity);

	var opacity = {
		computed: computedOpacity !== configOpacity ? ("opacity: " + computedOpacity + ";") : '',
		generated: computedOpacity !== configOpacity ? ("opacity: " + configOpacity + ";") : '',
	};

	/**
	 * Generate transformation styles
	 */
	var transformations = [];

	if (parseFloat(config.distance)) {
		var axis = config.origin === 'top' || config.origin === 'bottom' ? 'Y' : 'X';

		/**
		 * Let’s make sure our our pixel distances are negative for top and left.
		 * e.g. { origin: 'top', distance: '25px' } starts at `top: -25px` in CSS.
    	 */
		var distance = config.distance;
		if (config.origin === 'top' || config.origin === 'left') {
			distance = /^-/.test(distance) ? distance.substr(1) : ("-" + distance);
		}

		var ref = distance.match(/(^-?\d+\.?\d?)|(em$|px$|\%$)/g);
		var value = ref[0];
		var unit = ref[1];

		switch (unit) {
			case 'em':
				distance = parseInt(computed.fontSize) * value;
				break
			case 'px':
				distance = value;
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
				distance =
					axis === 'Y'
						? element.node.getBoundingClientRect().height * value / 100
						: element.node.getBoundingClientRect().width * value / 100;
				break
			default:
				throw new RangeError('Unrecognized or missing distance unit.')
		}

		if (axis === 'Y') {
			transformations.push(translateY(distance));
		} else {
			transformations.push(translateX(distance));
		}
	}

	if (config.rotate.x) { transformations.push(rotateX(config.rotate.x)); }
	if (config.rotate.y) { transformations.push(rotateY(config.rotate.y)); }
	if (config.rotate.z) { transformations.push(rotateZ(config.rotate.z)); }
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
			transformations.push(scale(0.0002));
		} else {
			transformations.push(scale(config.scale));
		}
	}

	var transform = {};
	if (transformations.length) {
		transform.property = getPrefixedStyleProperty('transform');
		/**
		* The default computed transform value should be one of:
		* undefined || 'none' || 'matrix()' || 'matrix3d()'
		*/
		transform.computed = {
			raw: computed[transform.property],
			matrix: parse(computed[transform.property]),
		};

		transformations.unshift(transform.computed.matrix);
		var product = transformations.reduce(multiply);

		transform.generated = {
			initial: ((transform.property) + ": matrix3d(" + (product.join(', ')) + ");"),
			final: ((transform.property) + ": matrix3d(" + (transform.computed.matrix.join(', ')) + ");"),
		};
	} else {
		transform.generated = {
			initial: '',
			final: '',
		};
	}

	/**
	 * Generate transition styles
	 */
	var transition = {};
	if (opacity.generated || transform.generated.initial) {
		transition.property = getPrefixedStyleProperty('transition');
		transition.computed = computed[transition.property];
		transition.fragments = [];

		var delay = config.delay;
		var duration = config.duration;
		var easing = config.easing;

		if (opacity.generated) {
			transition.fragments.push({
				delayed: ("opacity " + (duration / 1000) + "s " + easing + " " + (delay / 1000) + "s"),
				instant: ("opacity " + (duration / 1000) + "s " + easing + " 0s"),
			});
		}

		if (transform.generated.initial) {
			transition.fragments.push({
				delayed: ((transform.property) + " " + (duration / 1000) + "s " + easing + " " + (delay / 1000) + "s"),
				instant: ((transform.property) + " " + (duration / 1000) + "s " + easing + " 0s"),
			});
		}

		/**
		 * The default computed transition property should be one of:
		 * undefined || '' || 'all 0s ease 0s' || 'all 0s 0s cubic-bezier()'
		 */
		if (transition.computed && !transition.computed.match(/all 0s/)) {
			transition.fragments.unshift({
				delayed: transition.computed,
				instant: transition.computed,
			});
		}

		var composed = transition.fragments.reduce(
			function (composition, fragment, i) {
				composition.delayed += i === 0 ? fragment.delayed : (", " + (fragment.delayed));
				composition.instant += i === 0 ? fragment.instant : (", " + (fragment.instant));
				return composition
			},
			{
				delayed: '',
				instant: '',
			}
		);

		transition.generated = {
			delayed: ((transition.property) + ": " + (composed.delayed) + ";"),
			instant: ((transition.property) + ": " + (composed.instant) + ";"),
		};
	} else {
		transition.generated = {
			delayed: '',
			instant: '',
		};
	}

	return {
		inline: inline,
		opacity: opacity,
		position: position,
		transform: transform,
		transition: transition,
	}
}

function initialize () {
	var this$1 = this;

	rinse.call(this);

	each(this.store.elements, function (element) {
		var styles = [element.styles.inline.generated];

		if (element.visible) {
			styles.push(element.styles.opacity.computed);
			styles.push(element.styles.transform.generated.final);
		} else {
			styles.push(element.styles.opacity.generated);
			styles.push(element.styles.transform.generated.initial);
		}

		element.node.setAttribute('style', styles.filter(function (s) { return s !== ''; }).join(' '));
	});

	each(this.store.containers, function (container) {
		if (container.node === document.documentElement) {
			window.addEventListener('scroll', this$1.delegate);
			window.addEventListener('resize', this$1.delegate);
		} else {
			container.node.addEventListener('scroll', this$1.delegate);
			container.node.addEventListener('resize', this$1.delegate);
		}
	});

	/**
	 * Manually invoke delegate once to capture
	 * element and container dimensions, container
	 * scroll position, and trigger any valid reveals
	 */
	this.delegate();

	/**
	 * Wipe any existing `setTimeout` now
	 * that initialization has completed.
	 */
	this.initTimeout = null;
}

function animate (element, force) {
	if ( force === void 0 ) force = {};

	var pristine = force.pristine || this.pristine;
	var delayed =
		element.config.useDelay === 'always' ||
		(element.config.useDelay === 'onload' && pristine) ||
		(element.config.useDelay === 'once' && !element.seen);

	var shouldReveal = element.visible && !element.revealed;
	var shouldReset = !element.visible && element.revealed && element.config.reset;

	if (shouldReveal || force.reveal) {
		return triggerReveal.call(this, element, delayed)
	}

	if (shouldReset || force.reset) {
		return triggerReset.call(this, element)
	}
}

function triggerReveal (element, delayed) {
	var styles = [
		element.styles.inline.generated,
		element.styles.opacity.computed,
		element.styles.transform.generated.final ];
	if (delayed) {
		styles.push(element.styles.transition.generated.delayed);
	} else {
		styles.push(element.styles.transition.generated.instant);
	}
	element.revealed = element.seen = true;
	element.node.setAttribute('style', styles.filter(function (i) { return i !== ''; }).join(' '));
	registerCallbacks.call(this, element, delayed);
}

function triggerReset (element) {
	var styles = [
		element.styles.inline.generated,
		element.styles.opacity.generated,
		element.styles.transform.generated.initial,
		element.styles.transition.generated.instant ];
	element.revealed = false;
	element.node.setAttribute('style', styles.filter(function (i) { return i !== ''; }).join(' '));
	registerCallbacks.call(this, element);
}

function registerCallbacks (element, isDelayed) {
	var this$1 = this;

	var duration = isDelayed
		? element.config.duration + element.config.delay
		: element.config.duration;

	var beforeCallback = element.revealed
		? element.config.beforeReveal
		: element.config.beforeReset;

	var afterCallback = element.revealed ? element.config.afterReveal : element.config.afterReset;

	var elapsed = 0;
	if (element.callbackTimer) {
		elapsed = Date.now() - element.callbackTimer.start;
		window.clearTimeout(element.callbackTimer.clock);
	}

	beforeCallback(element.node);

	element.callbackTimer = {
		start: Date.now(),
		clock: window.setTimeout(function () {
			afterCallback(element.node);
			element.callbackTimer = null;
			if (element.revealed && !element.config.reset) {
				clean.call(this$1, element.node);
			}
		}, duration - elapsed),
	};
}

function sequence (element, pristine) {
	if ( pristine === void 0 ) pristine = this.pristine;

	var seq = this.store.sequences[element.sequence.id];
	var i = element.sequence.index;

	if (seq) {
		var visible = new SequenceModel('visible', seq, this.store);
		var revealed = new SequenceModel('revealed', seq, this.store);

		seq.models = { visible: visible, revealed: revealed };

		/**
		 * If the sequence has no revealed members,
		 * then we reveal the first visible element
		 * within that sequence.
		 *
		 * The sequence then cues a recursive call
		 * in both directions.
		 */
		if (!revealed.body.length) {
			var nextId = seq.members[visible.body[0]];
			var nextElement = this.store.elements[nextId];

			if (nextElement) {
				cue.call(this, seq, visible.body[0], -1, pristine);
				cue.call(this, seq, visible.body[0], +1, pristine);

				seq.lastReveal = visible.body[0];
				return animate.call(this, nextElement, { reveal: true, pristine: pristine })
			} else {
				return animate.call(this, element)
			}
		}

		/**
		 * Assuming we have something visible on screen
		 * already, and we need to evaluate the element
		 * that was passed in...
		 *
		 * We first check if the element should reset.
		 */
		if (!element.visible && element.revealed && element.config.reset) {
			seq.lastReset = i;
			return animate.call(this, element, { reset: true })
		}

		/**
		 * If our element isn’t resetting, we check the
		 * element sequence index against the head, and
		 * then the foot of the sequence.
		 */
		if (!seq.headblocked && i === [].concat( revealed.head ).pop() && i >= [].concat( visible.body ).shift()) {
			cue.call(this, seq, i, -1, pristine);
			seq.lastReveal = i;
			return animate.call(this, element, { reveal: true, pristine: pristine })
		}

		if (!seq.footblocked && i === [].concat( revealed.foot ).shift() && i <= [].concat( visible.body ).pop()) {
			cue.call(this, seq, i, +1, pristine);
			seq.lastReveal = i;
			return animate.call(this, element, { reveal: true, pristine: pristine })
		}
	}
}

function Sequence (interval) {
	if (typeof interval === 'number') {
		if (interval >= 16) {
			/**
			 * Instance details.
			 */
			this.id = nextUniqueId();
			this.interval = interval;
			this.members = [];

			/**
			 * Flow control for sequencing animations.
			 */
			this.headblocked = true;
			this.footblocked = true;

			/**
			 * The last successful member indexes,
			 * and a container for DOM models.
			 */
			this.lastReveal = null;
			this.lastReset = null;
			this.models = {};
		} else {
			throw new RangeError('Sequence interval must be at least 16ms.')
		}
	} else {
		return null
	}
}

function SequenceModel (prop, sequence, store) {
	var this$1 = this;

	this.head = []; // Elements before the body with a falsey prop.
	this.body = []; // Elements with a truthy prop.
	this.foot = []; // Elements after the body with a falsey prop.

	each(sequence.members, function (id, index) {
		var element = store.elements[id];
		if (element && element[prop]) {
			this$1.body.push(index);
		}
	});

	if (this.body.length) {
		each(sequence.members, function (id, index) {
			var element = store.elements[id];
			if (element && !element[prop]) {
				if (index < this$1.body[0]) {
					this$1.head.push(index);
				} else {
					this$1.foot.push(index);
				}
			}
		});
	}
}

function cue (seq, i, charge, pristine) {
	var this$1 = this;

	var blocked = ['headblocked', null, 'footblocked'][1 + charge];
	var nextId = seq.members[i + charge];
	var nextElement = this.store.elements[nextId];

	seq[blocked] = true;

	setTimeout(function () {
		seq[blocked] = false;
		if (nextElement) {
			sequence.call(this$1, nextElement, pristine);
		}
	}, seq.interval);
}

function reveal (target, options, interval, sync) {
	var this$1 = this;

	var containerBuffer = [];

	/**
	 * The reveal method has optional 2nd and 3rd parameters,
	 * so we first explicitly check what was passed in.
	 */
	if (typeof options === 'number') {
		interval = parseInt(options);
		options = {};
	} else {
		interval = parseInt(interval);
		options = options || {};
	}

	/**
	 * To start things off, build element collection,
	 * and attempt to instantiate a new sequence.
	 */
	var nodes;
	var sequence$$1;
	try {
		nodes = getNodes(target);
		sequence$$1 = interval ? new Sequence(interval) : null;
	} catch (e) {
		return logger.call(this, 'Reveal failed.', e.stack || e.message)
	}

	/**
	 * Begin element set-up...
	 */
	try {
		var elements = nodes.reduce(function (elementBuffer, elementNode) {
			var element = {};
			var existingId = elementNode.getAttribute('data-sr-id');

			if (existingId) {
				deepAssign(element, this$1.store.elements[existingId]);

				/**
				 * In order to prevent previously generated styles
				 * from throwing off the new styles, the style tag
				 * has to be reverted to it's pre-reveal state.
				 */
				element.node.setAttribute('style', element.styles.inline.computed);
			} else {
				element.id = nextUniqueId();
				element.node = elementNode;
				element.seen = false;
				element.revealed = false;
				element.visible = false;
			}

			var config = deepAssign({}, element.config || this$1.defaults, options);

			/**
			* Verify the current device passes our platform configuration,
			* and cache the result for the rest of the loop.
			*/
			var disabled;
			{
				if (disabled == null) {
					disabled = (!config.mobile && isMobile()) || (!config.desktop && !isMobile());
				}
				if (disabled) {
					if (existingId) {
						clean.call(this$1, element);
					}
					return elementBuffer
				}
			}

			var containerNode = getNode(config.container);

			var containerId;
			{
				if (!containerNode) {
					throw new Error('Invalid container.')
				}
				if (!containerNode.contains(elementNode)) {
					return elementBuffer // skip elements found outside the container
				}

				containerId = getContainerId(containerNode, containerBuffer, this$1.store.containers);

				if (containerId == null) {
					containerId = nextUniqueId();
					containerBuffer.push({ id: containerId, node: containerNode });
				}
			}

			element.config = config;
			element.containerId = containerId;
			element.styles = style(element);

			if (sequence$$1) {
				element.sequence = {
					id: sequence$$1.id,
					index: sequence$$1.members.length,
				};
				sequence$$1.members.push(element.id);
			}

			elementBuffer.push(element);
			return elementBuffer
		}, []);

		/**
		* Modifying the DOM via setAttribute needs to be handled
		* separately from reading computed styles in the map above
		* for the browser to batch DOM changes (limiting reflows)
		*/
		each(elements, function (element) {
			this$1.store.elements[element.id] = element;
			element.node.setAttribute('data-sr-id', element.id);
		});
	} catch (e) {
		return logger.call(this, 'Reveal failed.', e.stack || e.message)
	}

	/**
	 * Now that element set-up is complete...
	 * Let’s commit any container and sequence data we have to the store.
	 */
	{
		each(containerBuffer, function (container) {
			this$1.store.containers[container.id] = {
				id: container.id,
				node: container.node,
			};
		});
		if (sequence$$1) {
			this.store.sequences[sequence$$1.id] = sequence$$1;
		}
	}

	/**
	* If reveal wasn't invoked by sync, we want to
	* make sure to add this call to the history.
	*/
	if (!sync) {
		this.store.history.push({ target: target, options: options, interval: interval });

		/**
		* Push initialization to the event queue, giving
		* multiple reveal calls time to be interpreted.
		*/
		if (this.initTimeout) {
			window.clearTimeout(this.initTimeout);
		}
		this.initTimeout = window.setTimeout(initialize.bind(this), 0);
	}
}

function getContainerId (node) {
	var collections = [], len = arguments.length - 1;
	while ( len-- > 0 ) collections[ len ] = arguments[ len + 1 ];

	var id = null;
	each(collections, function (collection) {
		each(collection, function (container) {
			if (id === null && container.node === node) {
				id = container.id;
			}
		});
	});
	return id
}

/**
 * Re-runs the reveal method for each record stored in history,
 * for capturing new content asynchronously loaded into the DOM.
 */
function sync () {
	var this$1 = this;

	each(this.store.history, function (record) {
		reveal.call(this$1, record.target, record.options, record.interval, true);
	});

	initialize.call(this);
}

var polyfill = (function () {
	var clock = Date.now();

	return function (callback) {
		var currentTime = Date.now();
		if (currentTime - clock > 16) {
			clock = currentTime;
			callback(currentTime);
		} else {
			setTimeout(function () { return polyfill(callback); }, 0);
		}
	}
})();

// prettier-ignore
var requestAnimationFrame =
		window.requestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| polyfill;

function delegate (event, elements) {
	var this$1 = this;
	if ( event === void 0 ) event = { type: 'init' };
	if ( elements === void 0 ) elements = this.store.elements;

	requestAnimationFrame(function () {
		var stale = event.type === 'init' || event.type === 'resize';

		each(this$1.store.containers, function (container) {
			if (stale) {
				container.geometry = getGeometry.call(this$1, container, true);
			}
			container.scroll = getScrolled.call(this$1, container);
		});

		/**
		 * Due to how the sequencer is implemented, it’s
		 * important that we update the state of all
		 * elements, before any animation logic is
		 * evaluated (in the second loop below).
		 */
		each(elements, function (element) {
			if (stale) {
				element.geometry = getGeometry.call(this$1, element);
			}
			element.visible = isElementVisible.call(this$1, element);
		});

		each(elements, function (element) {
			if (element.sequence) {
				sequence.call(this$1, element);
			} else {
				animate.call(this$1, element);
			}
		});

		this$1.pristine = false;
	});
}

var version = "4.0.0-beta.19";

var _config;
var _debug;
var _instance;

function ScrollReveal (options) {
	var this$1 = this;
	if ( options === void 0 ) options = {};

	var invokedWithoutNew =
		typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollReveal.prototype;

	if (invokedWithoutNew) {
		return new ScrollReveal(options)
	}

	if (!ScrollReveal.isSupported()) {
		logger.call(this, 'Instantiation aborted.', 'This browser is not supported.');
		return noop
	}

	/**
	 * Here we use `buffer` to validate our configuration, before
	 * assigning the contents to the private variable `_config`.
	 */
	var buffer;
	{
		try {
			buffer = _config ? deepAssign({}, _config, options) : deepAssign({}, defaults, options);
		} catch (e) {
			logger.call(this, 'Instantiation failed.', 'Invalid configuration.', e.message);
			return noop
		}

		try {
			var container = getNode(buffer.container);
			if (!container) {
				throw new Error('Invalid container.')
			}
		} catch (e) {
			logger.call(this, 'Instantiation failed.', e.message);
			return noop
		}

		_config = buffer;
	}

	Object.defineProperty(this, 'defaults', { get: function () { return _config; } });

	/**
	 * Now that we have our configuration, we can
	 * make our last check for disabled platforms.
	 */
	if (this.defaults.mobile === isMobile() || this.defaults.desktop === !isMobile()) {
		/**
		 * Modify the DOM to reflect successful instantiation.
		 */
		document.documentElement.classList.add('sr');
		if (document.body) {
			document.body.style.height = '100%';
		} else {
			document.addEventListener('DOMContentLoaded', function () {
				document.body.style.height = '100%';
			});
		}
	}

	this.store = {
		containers: {},
		elements: {},
		history: [],
		sequences: {},
	};

	this.pristine = true;

	Object.defineProperty(this, 'delegate', { get: function () { return delegate.bind(this$1); } });
	Object.defineProperty(this, 'version', { get: function () { return version; } });
	Object.defineProperty(this, 'noop', { get: function () { return false; } });

	return _instance ? _instance : (_instance = this)
}

/**
 * Static members are available immediately during instantiation,
 * so debugging and browser support details are handled here.
 */
ScrollReveal.isSupported = function () { return transformSupported() && transitionSupported(); };

Object.defineProperty(ScrollReveal, 'debug', {
	get: function () { return _debug || false; },
	set: function (value) {
		if (typeof value === 'boolean') { _debug = value; }
	},
});

/**
 * The primary API is comprised
 * of these instance methods:
 */
ScrollReveal.prototype.clean = clean;
ScrollReveal.prototype.destroy = destroy;
ScrollReveal.prototype.reveal = reveal;
ScrollReveal.prototype.sync = sync;

return ScrollReveal;

})));
