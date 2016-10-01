class Toolbelt {

  /**
   * Iterates over object literal properties, ignoring the prototype chain.
   * @return void
   */
  forOwn (object, callback) {
    for (let property in object) {
      if (object.hasOwnProperty(property)) {
        callback(property)
      }
    }
  }

  /**
   * Compares the target against DOM Node characteristics.
   * @return {boolean}
   */
  isNode (target) {
    return typeof window.Node === 'object'
      ? target instanceof window.Node
      : target && typeof target === 'object' &&
        typeof target.nodeType === 'number' &&
        typeof target.nodeName === 'string'
  }

  /**
   * Compares the target against DOM Node List characteristics.
   * @return {boolean}
   */
  isNodeList (target) {
    var prototypeToString = Object.prototype.toString.call(target)
    var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/

    return typeof window.NodeList === 'object'
      ? target instanceof window.NodeList
      : target && typeof target === 'object' &&
        regex.test(prototypeToString) &&
        typeof target.length === 'number' &&
        (target.length === 0 || this.isNode(target[0]))
  }

  /**
   * Checks the current browser against a regex of modern agents.
   * @return {boolean}
   */
  isMobile () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
}

export default Toolbelt
