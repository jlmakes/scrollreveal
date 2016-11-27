export function isNode (target) {
  return typeof window.Node === 'object'
    ? target instanceof window.Node
    : target !== null &&
      typeof target === 'object' &&
      typeof target.nodeType === 'number' &&
      typeof target.nodeName === 'string';
}

export function isNodeList (target) {
  const prototypeToString = Object.prototype.toString.call(target);
  const regex = /^\[object (HTMLCollection|NodeList|Object)\]$/;

  return typeof window.NodeList === 'object'
    ? target instanceof window.NodeList
    : typeof target === 'object' &&
      typeof target.length === 'number' &&
      regex.test(prototypeToString) &&
      (target.length === 0 || isNode(target[0]));
}

export function transformSupported () {
  const style = document.documentElement.style;
  return 'transform' in style || 'WebkitTransform' in style;
}

export function transitionSupported () {
  const style = document.documentElement.style;
  return 'transition' in style || 'WebkitTransition' in style;
}

/* istanbul ignore next */
export const isMobile = function () {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};
