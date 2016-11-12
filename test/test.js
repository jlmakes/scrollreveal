/**
* Compares the target against DOM Node characteristics.
* @return {boolean}
*/
function isNode (target) {
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
function isNodeList (target) {
  var prototypeToString = Object.prototype.toString.call(target);
  var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/;

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


/**
 * Checks for CSS transform support.
 * @return {boolean}
 */


/**
 * Checks for CSS transition support.
 * @return {boolean}
 */

/* global describe, it, expect */
var utilsBrowserSpec = describe.bind(null, 'Browser Utilities', function () {

  describe('isNode()', function () {

    it('should return true when passed a DOM node', function () {
      var result = isNode(document.querySelector('#mocha'));
      expect(result).to.equal(true);
    });

    it('should return false when passed HTML as a string', function () {
      var result = isNode('<div class="foo"></div>');
      expect(result).to.equal(false);
    });
  });

  describe('isNodeList()', function () {

    it('should return true when passed a DOM node list', function () {
      var result = isNodeList(document.querySelectorAll('script'));
      expect(result).to.equal(true);
    });

    it('should return false when passed an array of HTML elements', function () {
      var result = isNodeList([].concat( document.querySelectorAll('script') ));
      expect(result).to.equal(false);
    });
  });
});

/**
* Sequential number generator for unique IDs.
* @return {number}
*/
var nextUniqueId = (function () {
  var uid = 0;
  return function () { return uid++; };
})();

/* global describe, it, expect */
var utilsGenericSpec = describe.bind(null, 'Generic Utilities', function () {

  describe('nextUniqueId()', function () {

    it('should start at 0', function () {
      var result = nextUniqueId();
      expect(result).to.equal(0);
    });

    it('should increment by 1', function () {
      var result = nextUniqueId();
      expect(result).to.equal(1);
    });

    it('should return a number', function () {
      var result = nextUniqueId();
      expect(result).to.be.a('number');
    });
  });
});

utilsBrowserSpec();
utilsGenericSpec();
