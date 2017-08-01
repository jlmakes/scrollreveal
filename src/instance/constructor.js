import defaults from './defaults'
import noop from './noop'

import clean from './methods/clean'
import destroy from './methods/destroy'
import reveal from './methods/reveal'
import sync from './methods/sync'

import delegate from './functions/delegate'

import { isMobile, transformSupported, transitionSupported } from '../utils/browser'
import { getNode, logger } from '../utils/core'
import { deepAssign } from '../utils/generic'

import { version } from '../../package.json'


let _config
let _debug
let _instance

export default function ScrollReveal (options = {}) {

	/**
	 * Support instantiation without the `new` keyword.
	 */
	if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollReveal.prototype) {
		return new ScrollReveal(options)
	}

	Object.defineProperty(this, 'debug', {
		get: () => _debug || false,
		set: value => {
			if (typeof value === 'boolean') _debug = value
		},
	})

	if (!ScrollReveal.isSupported()) {
		logger.call(this, 'Instantiation aborted.', 'This browser is not supported.')
		return noop
	}

	Object.defineProperty(this, 'defaults', {
		get: () => _config,
	})

	/**
	 * Here we use `buffer` to validate our configuration, before
	 * assigning the contents to the private variable `_config`.
	 */
	let buffer
	{
		try {
			buffer = _config
				? deepAssign({}, _config, options)
				: deepAssign({}, defaults, options)
		} catch (e) {
			logger.call(this, 'Instantiation failed.', 'Invalid configuration.', e.message)
			return noop
		}

		try {
			const container = getNode(buffer.container)
			if (!container) {
				throw new Error('Invalid container.')
			}
		} catch (e) {
			logger.call(this, 'Instantiation failed.', e.message)
			return noop
		}

		_config = buffer
	}

	/**
	 * Now that we have our configuration, we can
	 * make our last check for disabled platforms.
	 */
	if (this.defaults.mobile === isMobile() || this.defaults.desktop === !isMobile()) {
		/**
		 * Modify the DOM to reflect successful instantiation.
		 */
		document.documentElement.classList.add('sr')
		document.addEventListener('DOMContentLoaded', () => {
			window.setTimeout(() => document.body.style.height = '100%', 0)
		})
	}

	this.store = {
		containers: {},
		elements: {},
		history: [],
		sequences: {},
	}

	this.pristine = true

	Object.defineProperty(this, 'delegate', { get: () => delegate.bind(this) })
	Object.defineProperty(this, 'version', { get: () => version })
	Object.defineProperty(this, 'noop', { get: () => false })

	return _instance ? _instance : _instance = this
}

ScrollReveal.isSupported = () => transformSupported() && transitionSupported()

ScrollReveal.prototype.clean = clean
ScrollReveal.prototype.destroy = destroy
ScrollReveal.prototype.reveal = reveal
ScrollReveal.prototype.sync = sync
