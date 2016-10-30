

/**
* Compares the target against DOM Node characteristics.
* @return {boolean}
*/
export function isNode (target) {
  return typeof window.Node === 'object'
    ? target instanceof window.Node
    : typeof target === 'object' &&
      typeof target.nodeType === 'number' &&
      typeof target.nodeName === 'string';
}

/**
* Compares the target against DOM Node List characteristics.
* @return {boolean}
*/
export function isNodeList (target) {
  const prototypeToString = Object.prototype.toString.call(target);
  const regex = /^\[object (HTMLCollection|NodeList|Object)\]$/;

  return typeof window.NodeList === 'object'
    ? target instanceof window.NodeList
    : typeof target === 'object' &&
      typeof target.length === 'number' &&
      regex.test(prototypeToString) &&
      (target.length === 0 || this.isNode(target[0]));
}

/**
* Checks the current browser against a regex of modern agents.
* @return {boolean}
*/
export function isMobile () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent);
}

/**
 * Checks for CSS transform support.
 * @return {boolean}
 */
export function transformSupported () {
  const style = document.documentElement.style;
  return 'transform' in style || 'WebkitTransform' in style;
}

/**
 * Checks for CSS transition support.
 * @return {boolean}
 */
export function transitionSupported () {
  const style = document.documentElement.style;
  return 'transition' in style || 'WebkitTransition' in style;
}
