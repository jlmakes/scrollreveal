var defaults = {
  origin: 'bottom',
  distance: '0',
  duration: 300,
  delay: 0,
  rotate: {
    x: 0,
    y: 0,
    z: 0,
  },
  opacity: 0,
  scale: 1,
  easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',
  container: document.documentElement,
  mobile: true,
  reset: false,
  useDelay: 'always',
  viewFactor: 0.2,
  viewOffset: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  beforeReveal: function beforeReveal () {},
  beforeReset: function beforeReset () {},
  afterReveal: function afterReveal () {},
  afterReset: function afterReset () {},
};

var polyfill = (function () {
  var timeLast = 0;

  return function (callback) {
    /**
     * Dynamically set the delay on a per-tick basis to more closely match 60fps.
     * Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671
     */
    var timeCurrent = Date.now();
    var timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
    timeLast = timeCurrent + timeDelta;

    return window.setTimeout(function () {
      callback(timeCurrent + timeDelta);
    }, timeDelta);
  };
})();

var requestAnimationFrame = window.requestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              polyfill;

function animate () {
  // ...
}

function handler () {
  requestAnimationFrame(animate.bind(this));
}

function initialize () {
  var this$1 = this;

  this.initialized = true;

  this.store.containers.forEach(function (container) {
    if (container === document.documentElement) {
      window.addEventListener('scroll', handler.bind(this$1));
      window.addEventListener('resize', handler.bind(this$1));
    } else {
      container.addEventListener('scroll', handler.bind(this$1));
      container.addEventListener('resize', handler.bind(this$1));
    }
  });

  animate.call(this);
}

function remove () {
  this.initialized = false;

  this.store.containers.forEach(function (container) {
    if (container === document.documentElement) {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    } else {
      container.removeEventListener('scroll', handler);
      container.removeEventListener('resize', handler);
    }
  });
}

function reveal () {
  // something...
}

/**
 * Re-runs `reveal()` for each record stored in history, effectively capturing
 * any content loaded asynchronously that matches existing reveal set targets.
 * @return {object} - The current ScrollReveal instance.
 */
function sync () {
  var this$1 = this;

  this.store.history.forEach(function (record) {
    reveal.call(this$1, record.target, record.config, record.interval, false);
  });

  initialize.call(this);

  return this;
}

function watch () {
  // something...
}

/**
* Compares the target against DOM Node characteristics.
* @return {boolean}
*/


/**
* Compares the target against DOM Node List characteristics.
* @return {boolean}
*/


/**
* Checks the current browser against a regex of modern agents.
* @return {boolean}
*/


/**
 * Checks for CSS transform support.
 * @return {boolean}
 */
function transformSupported () {
  var style = document.documentElement.style;
  return 'transform' in style || 'WebkitTransform' in style;
}

/**
 * Checks for CSS transition support.
 * @return {boolean}
 */
function transitionSupported () {
  var style = document.documentElement.style;
  return 'transition' in style || 'WebkitTransition' in style;
}

/**
* Version : 4.0.0-alpha.1
* Website : scrollrevealjs.org
* Repo    : github.com/jlmakes/scrollreveal
* Author  : Julian Lloyd (@jlmakes)
*/

function ScrollReveal (config) {
  if ( config === void 0 ) config = {};

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
      get: (function () {
        var options = {};
        Object.assign(options, defaults, config);
        return function () { return options; };
      })(),
    });

    this.store = {
      containers: [],
      elements: [],
      history: [],
      sequences: [],
    };

    this.store.containers.push(this.defaults.container);
  } else {
    return {};
  }
}

ScrollReveal.prototype.remove = remove;
ScrollReveal.prototype.reveal = reveal;
ScrollReveal.prototype.sync = sync;
ScrollReveal.prototype.watch = watch;

if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
  define(function () { return ScrollReveal; });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollReveal;
} else {
  window.ScrollReveal = ScrollReveal;
}
