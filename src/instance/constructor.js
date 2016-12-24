import defaults from './defaults';
import noop from './noop';

import remove from './methods/remove';
import reveal from './methods/reveal';
import sync from './methods/sync';
import watch from './methods/watch';

import { transformSupported, transitionSupported } from '../utils/browser';
import { getNode, logger } from '../utils/core';
import { deepAssign } from '../utils/generic';


export default function ScrollReveal (options = {}) {

	// Returns a new instance without `new` keyword.
	if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollReveal.prototype) {
		return new ScrollReveal(options);
	}

	if (!ScrollReveal.isSupported()) {
		logger('This browser is not supported.');
		return noop;
	}

	this.initialized = false;
	document.documentElement.classList.add('sr');

	try {
		Object.defineProperty(this, 'defaults', {
			get: (() => {
				const config = {};
				deepAssign(config, defaults, options);
				return () => config;
			})(),
		});
	} catch (error) {
		logger(error.message);
		return noop;
	}

	this.store = {
		containers: [],
		elements: [],
		history: [],
		sequences: [],
	};

	const container = getNode(this.defaults.container);
	if (container) {
		this.store.containers.push(container);
	} else {
		logger('Failed to instantiate due to missing container.');
		return noop;
	}
}

ScrollReveal.isSupported = () => transformSupported() && transitionSupported();

ScrollReveal.prototype.remove = remove;
ScrollReveal.prototype.reveal = reveal;
ScrollReveal.prototype.sync = sync;
ScrollReveal.prototype.watch = watch;

/* istanbul ignore next */
if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
	define(() => ScrollReveal);
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = ScrollReveal;
} else {
	window.ScrollReveal = ScrollReveal;
}
