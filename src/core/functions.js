import { requestAnimationFrame } from '../polyfills/requestAnimationFrame';
import { isNode, isNodeList } from '../utils/browser';
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

export function getElement (target, container = document) {
  let element = null;
  if (typeof target === 'string') {
    try {
      element = container.querySelector(target);
      if (!element) {
        logger(`Querying the selector "${target}" returned nothing.`);
      }
    } catch (err) {
      logger(`"${target}" is not a valid selector.`);
    }
  }
  return isNode(target) ? target : element;
}


export function getElements (target, container = document) {
  let elements = [];
  if (typeof target === 'string') {
    try {
      const query = container.querySelectorAll(target);
      elements = Array.prototype.slice.call(query);
      if (!elements.length) {
        logger(`Querying the selector "${target}" returned nothing.`);
      }
    } catch (err) {
      logger(`"${target}" is not a valid selector.`);
    }
  } else if (isNode(target)) {
    elements.push(target);
  }
  return isNodeList(target) ? Array.prototype.slice.call(target) : elements;
}
