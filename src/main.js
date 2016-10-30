

/**
* Version : 4.0.0-alpha.1
* Website : scrollreveal.com
* Repo    : github.com/jlmakes/scrollreveal
* Author  : Julian Lloyd (@jlmakes)
*/

import defaults from './lib/defaults';

import remove from './methods/remove';
import reveal from './methods/reveal';
import sync from './methods/sync';
import watch from './methods/watch';

import { transformSupported, transitionSupported } from './utils/browser';

function ScrollReveal (config = {}) {
  /**
   * Support instantiation without the `new` keyword.
   */
  if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollReveal.prototype) {
    return new ScrollReveal(config);
  } else if (transformSupported() && transitionSupported()) {
    /**
     * Add CSS hook to `<html>` element for supported browsers.
     */
    document.documentElement.classList.add('sr');

    this.initialized = false;

    Object.defineProperty(this, 'defaults', {
      get: (() => {
        const options = {};
        Object.assign(options, defaults, config);
        return () => options;
      })(),
    });

    this.store = {
      containers: new Set(),
      elements: new Map(),
      history: [],
      sequences: [],
    };

    this.store.containers.add(this.defaults.container);
  } else {
    return {};
  }
}

ScrollReveal.prototype.remove = remove;
ScrollReveal.prototype.reveal = reveal;
ScrollReveal.prototype.sync = sync;
ScrollReveal.prototype.watch = watch;

if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
  define(() => ScrollReveal);
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollReveal;
} else {
  window.ScrollReveal = ScrollReveal;
}
