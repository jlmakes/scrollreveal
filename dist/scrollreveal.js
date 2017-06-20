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
	get noop () { return true },
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
	return object !== null && typeof object === 'object'
		&& (object.constructor === Object || Object.prototype.toString.call(object) === '[object Object]')
}


function each (collection, callback) {
	if (isObject(collection)) {
		var keys = Object.keys(collection);
		for (var i = 0; i < keys.length; i++) {
			callback(collection[ keys[i] ], keys[i], collection);
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
				return properties[name] = name
			}
			if (typeof source[("-webkit-" + name)] === 'string') {
				return properties[name] = "-webkit-" + name
			}
			throw new RangeError(("Unable to find \"" + name + "\" style property."))
		}
		throw new TypeError('Expected a string.')
	}

	getPrefixedStyleProperty.clearCache = function () { return properties = {}; };

	return getPrefixedStyleProperty
})();


function isMobile (agent) {
	if ( agent === void 0 ) agent = navigator.userAgent;

	return /Android|iPhone|iPad|iPod/i.test(agent)
}


function isNode (target) {
	return typeof window.Node === 'object'
		? target instanceof window.Node
		: target !== null
			&& typeof target === 'object'
			&& typeof target.nodeType === 'number'
			&& typeof target.nodeName === 'string'
}


function isNodeList (target) {
	var prototypeToString = Object.prototype.toString.call(target);
	var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/;

	return typeof window.NodeList === 'object'
		? target instanceof window.NodeList
		: typeof target === 'object'
			&& typeof target.length === 'number'
			&& regex.test(prototypeToString)
			&& (target.length === 0 || isNode(target[0]))
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

	return elementBounds.top < containerBounds.bottom
		&& elementBounds.right > containerBounds.left
		&& elementBounds.bottom > containerBounds.top
		&& elementBounds.left < containerBounds.right
		|| element.styles.position === 'fixed'
}


function getGeometry (target, isContainer) {
	/**
	 * We want to ignore padding and scrollbars for container elements.
	 * More information here: https://goo.gl/vOZpbz
	 */
	var height = (isContainer) ? target.node.clientHeight : target.node.offsetHeight;
	var width = (isContainer) ? target.node.clientWidth : target.node.offsetWidth;

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

	if (isNode(target)) {
		return [target]
	}
	if (isNodeList(target)) {
		return Array.prototype.slice.call(target)
	}
	var query;
	if (typeof target === 'string') {
		try {
			query = container.querySelectorAll(target);
		} catch (e) {
			throw new Error(("\"" + target + "\" is not a valid selector."))
		}
		if (query.length === 0) {
			throw new Error(("The selector \"" + target + "\" matches 0 elements."))
		}
	}
	return Array.prototype.slice.call(query)
}


function getScrolled (container) {
	return (container.node === document.documentElement)
		? {
			top: window.pageYOffset,
			left: window.pageXOffset,
		} : {
			top: container.node.scrollTop,
			left: container.node.scrollLeft,
		}
}


function logger (message) {
	var details = [], len = arguments.length - 1;
	while ( len-- > 0 ) details[ len ] = arguments[ len + 1 ];

	if (this.debug && console) {
		var report = "ScrollReveal: " + message;
		details.forEach(function (detail) { return report += "\n  - " + detail; });
		console.log(report); // eslint-disable-line no-console
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
				node.setAttribute('style', this$1.store.elements[id].styles.inline);
				node.removeAttribute('data-sr-id');
				delete this$1.store.elements[id];
			}
		});
	} catch (e) {
		return logger.call(this, 'Clean failed.', e.message)
	}

	if (dirty) {
		try {
			rinse.call(this);
		} catch (e) {
			return logger.call(this, 'Clean failed.', 'Rinse failed.', e.message)
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

/*  @license Rematrix v0.1.0

    Copyright (c) 2017, Fisssion LLC

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
 * > **Tip:** Similar to how `5 * 1 === 5`, where `1` is the identity number.
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
			var raw = match[2].split(', ').map(function (value) { return parseFloat(value); });
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
* @param  {number} scalarX   - Decimal multiplier.
* @param  {number} [scalarY] - Decimal multiplier.
* @return {array}
*/
function scale (scalarX, scalarY) {
	var matrix = identity();
	matrix[0] = scalarX;
	matrix[5] = scalarY || scalarX;
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
	var inlineRegex = /.+[^;]/g;
	var inlineStyle = element.node.getAttribute('style') || '';
	var inlineMatch = inlineRegex.exec(inlineStyle);

	var inline = (inlineMatch) ? ((inlineMatch[0]) + ";") : '';
	if (inline.indexOf('visibility: visible') === -1) {
		inline += (inline.length) ? ' ' : '';
		inline += 'visibility: visible;';
	}

	/**
	 * Generate opacity styles
	 */
	var computedOpacity = parseFloat(computed.opacity);
	var configOpacity = !isNaN(parseFloat(config.opacity))
		? parseFloat(config.opacity)
		: parseFloat(computed.opacity);

	var opacity = {
		computed: (computedOpacity !== configOpacity) ? ("opacity: " + computedOpacity + ";") : '',
		generated: (computedOpacity !== configOpacity) ? ("opacity: " + configOpacity + ";") : '',
	};

	/**
	 * Generate transformation styles
	 */
	var transformations = [];

	if (parseFloat(config.distance)) {
		var axis = (config.origin === 'top' || config.origin === 'bottom') ? 'Y' : 'X';

		/**
		 * Let’s make sure our our pixel distances are negative for top and left.
		 * e.g. { origin: 'top', distance: '25px' } starts at `top: -25px` in CSS.
    	 */
		var distance = config.distance;
		if (config.origin === 'top' || config.origin === 'left') {
			distance = /^-/.test(distance)
				? distance.substr(1)
				: ("-" + distance);
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
				distance = (axis === 'Y')
					? element.node.getBoundingClientRect().height * value / 100
					: element.node.getBoundingClientRect().width * value / 100;
				break
			default:
				throw new RangeError('Unrecognized or missing distance unit.')
		}

		(axis === 'Y')
			? transformations.push(translateY(distance))
			: transformations.push(translateX(distance));
	}

	if (config.rotate.x) { transformations.push(rotateX(config.rotate.x)); }
	if (config.rotate.y) { transformations.push(rotateY(config.rotate.y)); }
	if (config.rotate.z) { transformations.push(rotateZ(config.rotate.z)); }
	if (config.scale !== 1) {
		config.scale === 0
			? transformations.push(scale(0.0002))
			: transformations.push(scale(config.scale));
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

		var composed = transition.fragments.reduce(function (composition, fragment, i) {
			composition.delayed += (i === 0) ? fragment.delayed : (", " + (fragment.delayed));
			composition.instant += (i === 0) ? fragment.instant : (", " + (fragment.instant));
			return composition
		}, {
			delayed: '',
			instant: '',
		});

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
		var styles = [element.styles.inline];

		if (element.visible) {
			styles.push(element.styles.opacity.computed);
			styles.push(element.styles.transform.generated.final);
		} else {
			styles.push(element.styles.opacity.generated);
			styles.push(element.styles.transform.generated.initial);
		}

		element.node.setAttribute('style', styles.filter(function (i) { return i !== ''; }).join(' '));
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

	this.initTimeout = null;
}

function reveal (target, options, interval, sync) {
	var this$1 = this;


	/**
	 * The reveal method has an optional 2nd parameter,
	 * so here we just shuffle things around to accept
	 * the interval being passed as the 2nd argument.
	 */
	if (typeof options === 'number') {
		interval = Math.abs(parseInt(options));
		options = {};
	} else {
		interval = Math.abs(parseInt(interval));
		options = options || {};
	}

	var config = deepAssign({}, this.defaults, options);
	var containers = this.store.containers;

	var container;
	var targets;
	try {
		container = getNode(config.container);
		if (!container) {
			throw new Error('Invalid container.')
		}
		targets = getNodes(target, container);
		if (!targets) {
			throw new Error('Nothing to animate.')
		}
	} catch (e) {
		return logger.call(this, 'Reveal failed.', e.message)
	}

	/**
	 * Verify our platform matches our platform configuration.
	 */
	if (!config.mobile && isMobile() || !config.desktop && !isMobile()) {
		return logger.call(this, 'Reveal aborted.', 'This platform has been disabled.')
	}

	/**
	 * Sequence intervals must be at least 16ms (60fps).
	 */
	var sequence;
	if (interval) {
		if (interval >= 16) {
			var sequenceId = nextUniqueId();
			sequence = {
				elementIds: [],
				nose: { blocked: false, index: null, pointer: null },
				tail: { blocked: false, index: null, pointer: null },
				id: sequenceId,
				interval: Math.abs(interval),
			};
		} else {
			return logger.call(this, 'Reveal failed.', 'Sequence interval must be at least 16ms.')
		}
	}

	var containerId;
	each(containers, function (storedContainer) {
		if (!containerId && storedContainer.node === container) {
			containerId = storedContainer.id;
		}
	});

	if (isNaN(containerId)) {
		containerId = nextUniqueId();
	}

	try {
		var elements = targets.map(function (node) {
			var element = {};
			var existingId = node.getAttribute('data-sr-id');

			if (existingId) {
				deepAssign(element, this$1.store.elements[existingId]);

				/**
				 * In order to prevent previously generated styles
				 * from throwing off the new styles, the style tag
				 * has to be reverted to it's pre-reveal state.
				 */
				element.node.setAttribute('style', element.styles.inline);

			} else {
				element.id = nextUniqueId();
				element.node = node;
				element.seen = false;
				element.revealed = false;
				element.visible = false;
			}

			element.config = config;
			element.containerId = containerId;
			element.styles = style(element);

			if (sequence) {
				element.sequence = {
					id: sequence.id,
					index: sequence.elementIds.length,
				};
				sequence.elementIds.push(element.id);
			}

			return element
		});

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
		return logger.call(this, 'Reveal failed.', e.message)
	}

	containers[containerId] = containers[containerId] || {
		id: containerId,
		node: container,
	};

	if (sequence) {
		this.store.sequences[sequence.id] = sequence;
	}

	/**
	* If reveal wasn't invoked by sync, we want to
	* make sure to add this call to the history.
	*/
	if (!sync) {
		this.store.history.push({ target: target, options: options, interval: interval });

		/**
		* Push initialization to the event queue, giving
		* multiple reveal calls time to be interpretted.
		*/
		if (this.initTimeout) {
			window.clearTimeout(this.initTimeout);
		}
		this.initTimeout = window.setTimeout(initialize.bind(this), 0);
	}
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

function animate (element, sequencing) {

	var sequence = (element.sequence) ? this.store.sequences[element.sequence.id] : false;
	var delayed = element.config.useDelay === 'always'
		|| element.config.useDelay === 'onload' && this.pristine
		|| element.config.useDelay === 'once' && !element.seen;

	element.visible = isElementVisible.call(this, element);

	if (sequencing) {
		if (element.sequence.index === sequence.nose.pointer - 1 && sequence.nose.pointer > sequence.nose.index) {
			sequence.nose.pointer--;
			queueSequenceNose.call(this, sequence);
		} else if (element.sequence.index === sequence.tail.pointer + 1 && sequence.tail.pointer < sequence.tail.index) {
			sequence.tail.pointer++;
			queueSequenceTail.call(this, sequence);
		} else {
			return
		}
		return triggerReveal.call(this, element, delayed)
	}

	if (element.visible && !element.revealed) {
		if (sequence) {
			updateSequenceIndexes.call(this, sequence);
			if (sequence.nose.pointer === null && sequence.tail.pointer === null) {
				sequence.nose.pointer = sequence.tail.pointer = element.sequence.index;
				queueSequenceNose.call(this, sequence);
				queueSequenceTail.call(this, sequence);
			} else if (element.sequence.index === sequence.nose.pointer - 1 && !sequence.nose.blocked) {
				sequence.nose.pointer--;
				queueSequenceNose.call(this, sequence);
			} else if (element.sequence.index === sequence.tail.pointer + 1 && !sequence.tail.blocked) {
				sequence.tail.pointer++;
				queueSequenceTail.call(this, sequence);
			} else {
				return
			}
		}
		return triggerReveal.call(this, element, delayed)
	}

	if (!element.visible && element.revealed && element.config.reset) {
		if (sequence) {
			updateSequenceIndexes.call(this, sequence);
			if (sequence.nose.index !== Infinity && sequence.tail.index !== -Infinity) {
				sequence.nose.pointer = Math.max(sequence.nose.pointer, sequence.nose.index);
				sequence.tail.pointer = Math.min(sequence.tail.pointer, sequence.tail.index);
			}
		}
		return triggerReset.call(this, element)
	}
}


function triggerReveal (element, delayed) {
	var styles = [
		element.styles.inline,
		element.styles.opacity.computed,
		element.styles.transform.generated.final ];
	delayed
		? styles.push(element.styles.transition.generated.delayed)
		: styles.push(element.styles.transition.generated.instant);
	element.revealed = element.seen = true;
	element.node.setAttribute('style', styles.filter(function (i) { return i !== ''; }).join(' '));
	registerCallbacks.call(this, element, delayed);
}


function triggerReset (element) {
	var styles = [
		element.styles.inline,
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

	var afterCallback = element.revealed
		? element.config.afterReveal
		: element.config.afterReset;

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


function updateSequenceIndexes (sequence) {
	var this$1 = this;

	var min = Infinity;
	var max = -Infinity;
	each(sequence.elementIds, function (id) {
		var element = this$1.store.elements[id];
		if (element && element.visible) {
			min = Math.min(min, element.sequence.index);
			max = Math.max(max, element.sequence.index);
		}
	});
	sequence.nose.index = min;
	sequence.tail.index = max;
}


function queueSequenceNose (sequence) {
	var this$1 = this;

	var nextId = sequence.elementIds[sequence.nose.pointer - 1];
	var nextElement = this.store.elements[nextId];
	if (nextElement) {
		sequence.nose.blocked = true;
		window.setTimeout(function () {
			sequence.nose.blocked = false;
			animate.call(this$1, nextElement, true);
		}, sequence.interval);
	}
}


function queueSequenceTail (sequence) {
	var this$1 = this;

	var nextId = sequence.elementIds[sequence.tail.pointer + 1];
	var nextElement = this.store.elements[nextId];
	if (nextElement) {
		sequence.tail.blocked = true;
		window.setTimeout(function () {
			sequence.tail.blocked = false;
			animate.call(this$1, nextElement, true);
		}, sequence.interval);
	}
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


var requestAnimationFrame = window.requestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| polyfill;

function delegate (event) {
	var this$1 = this;
	if ( event === void 0 ) event = {};

	requestAnimationFrame(function () {
		var containers = this$1.store.containers;
		var elements = this$1.store.elements;

		switch (event.type) {

			case 'scroll':
				each(containers, function (container) { return container.scroll = getScrolled.call(this$1, container); });
				each(elements, function (element) { return animate.call(this$1, element); });
				break

			case 'resize':
			default:
				each(containers, function (container) {
					container.geometry = getGeometry.call(this$1, container, /* isContainer: */ true);
					container.scroll = getScrolled.call(this$1, container);
				});
				each(elements, function (element) {
					element.geometry = getGeometry.call(this$1, element);
					animate.call(this$1, element);
				});
		}

		this$1.pristine = false;
	});
}

var version = "4.0.0-beta.9";

function ScrollReveal (options) {
	var this$1 = this;
	if ( options === void 0 ) options = {};


	/**
	 * Support instantiation without the `new` keyword.
	 */
	if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollReveal.prototype) {
		return new ScrollReveal(options)
	}

	var _debug = false;
	Object.defineProperty(this, 'debug', {
		get: function () { return _debug; },
		set: function (value) {
			if (typeof value === 'boolean') { _debug = value; }
		},
	});

	if (!ScrollReveal.isSupported()) {
		logger.call(this, 'Instantiation aborted.', 'This browser is not supported.');
		return noop
	}

	try {
		Object.defineProperty(this, 'defaults', {
			get: (function () {
				var config = {};
				deepAssign(config, defaults, options);
				return function () { return config; }
			})(),
		});
	} catch (e) {
		logger.call(this, 'Instantiation failed.', 'Invalid configuration.', e.message);
		return noop
	}

	try {
		var container = getNode(this.defaults.container);
		if (!container) {
			throw new Error('Invalid container.')
		}
	} catch (e) {
		logger.call(this, 'Instantiation failed.', e.message);
		return noop
	}

	if (this.defaults.mobile === isMobile() || this.defaults.desktop === !isMobile()) {
		document.documentElement.classList.add('sr');
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
}

ScrollReveal.isSupported = function () { return transformSupported() && transitionSupported(); };

ScrollReveal.prototype.clean = clean;
ScrollReveal.prototype.destroy = destroy;
ScrollReveal.prototype.reveal = reveal;
ScrollReveal.prototype.sync = sync;

/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////             /////    /////
/////             /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
         /////    /////
         /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////

/*!
 * ScrollReveal
 * ------------
 * Website : https://scrollrevealjs.org
 * Support : https://github.com/jlmakes/scrollreveal/issues
 * Author  : https://twitter.com/jlmakes
 *
 * Licensed under the GNU General Public License 3.0 for
 * compatible open source projects and non-commercial use.
 *
 * For commercial sites, themes, projects, and applications,
 * keep your source code proprietary and please purchase a
 * commercial license from https://scrollrevealjs.org
 *
 * Copyright (c) 2014–2017 Julian Lloyd. All rights reserved.
 */

return ScrollReveal;

})));
