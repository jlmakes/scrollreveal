import requestAnimationFrame from '../polyfills/requestAnimationFrame';
import { isNode } from '../utils/browser';
import { logger } from '../utils/generic';

export function animate () {
  // ...
}

export function handler () {
  // requestAnimationFrame(animate.bind(this));
}

export function initialize () {
  // this.initialized = true;
  //
  // this.store.containers.forEach((container) => {
  //   if (container === document.documentElement) {
  //     window.addEventListener('scroll', handler.bind(this));
  //     window.addEventListener('resize', handler.bind(this));
  //   } else {
  //     container.addEventListener('scroll', handler.bind(this));
  //     container.addEventListener('resize', handler.bind(this));
  //   }
  // });
  //
  // animate.call(this);
}

export function getContainerElement (target) {
  let container = null;
  if (typeof target === 'string') {
    try {
      container = document.querySelector(target);
      if (!container) {
        logger(`Querying the selector "${target}" returned nothing.`);
      }
    } catch (err) {
      logger(`"${target}" is not a valid selector.`);
    }
  }
  return isNode(target) ? target : container;
}
