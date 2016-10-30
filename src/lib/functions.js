

import requestAnimationFrame from '../polyfills/requestAnimationFrame';

export function animate () {
  // ...
}

export function handler () {
  requestAnimationFrame(animate.bind(this));
}

export function initialize () {
  this.initialized = true;

  for (const container of this.store.containers) {
    if (container === document.documentElement) {
      window.addEventListener('scroll', handler.bind(this));
      window.addEventListener('resize', handler.bind(this));
    } else {
      container.addEventListener('scroll', handler.bind(this));
      container.addEventListener('resize', handler.bind(this));
    }
  }

  animate.call(this);
}
