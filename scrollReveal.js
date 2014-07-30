/*
 _ _ _____                      _   _
 | | |  __ \                    | | (_)
 ___  ___ _ __ ___ | | | |__) |_____   _____  __ _| |  _ ___
 / __|/ __| '__/ _ \| | |  _  // _ \ \ / / _ \/ _` | | | / __|
 \__ \ (__| | | (_) | | | | \ \  __/\ V /  __/ (_| | |_| \__ \
 |___/\___|_|  \___/|_|_|_|  \_\___| \_/ \___|\__,_|_(_) |___/ v.0.1.2
 _/ |
 |__/

 "Declarative on-scroll reveal animations."

 /*=============================================================================

 scrollReveal.js was inspired by cbpScroller.js (c) 2014 Codrops.

 Licensed under the MIT license.
 http://www.opensource.org/licenses/mit-license.php

 =============================================================================*/

/*! scrollReveal.js v0.1.3 (c) 2014 Julian Lloyd | MIT license */

/*===========================================================================*/


window.scrollReveal = (function (window) {

    'use strict';

    // generator (increments) for the next scroll-reveal-id
    var nextId = 1;

    /**
     * RequestAnimationFrame polyfill
     * @function
     * @private
     */
    var requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }());

    function scrollReveal(options) {

        this.options = this.extend(this.defaults, options);
        this.docElem = this.options.elem;
        this.styleBank = {};

        if (this.options.init == true) this.init();
    }

    scrollReveal.prototype = {

        defaults: {
            elem: window.document.documentElement,
            after: '0s',
            enter: 'bottom',
            move: '24px',
            over: '0.66s',
            easing: 'ease-in-out',
            opacity: 0,

            //  if 0, the element is considered in the viewport as soon as it enters
            //  if 1, the element is considered in the viewport when it's fully visible
            viewportFactor: 0.33,

            // if false, animations occur only once
            // if true, animations occur each time an element enters the viewport
            reset: false,

            // if true, scrollReveal.init() is automaticaly called upon instantiation
            init: true
        },

        /*=============================================================================*/

        init: function () {

            this.scrolled = false;

            var self = this;

            //  Check DOM for the data-scrollReveal attribute
            //  and initialize all found elements.
            this.elems = Array.prototype.slice.call(this.docElem.querySelectorAll('[data-scroll-reveal]'));
            this.elems.forEach(function (el, i) {

                //  Capture original style attribute
                var id = el.getAttribute("data-scroll-reveal-id");
                if (!id) {
                    id = nextId++;
                    el.setAttribute("data-scroll-reveal-id", id);
                }
                if (!self.styleBank[id]) {
                    self.styleBank[id] = el.getAttribute('style');
                }

                self.update(el);
            });

            var scrollHandler = function (e) {
                // No changing, exit
                if (!self.scrolled) {
                    self.scrolled = true;
                    requestAnimFrame(function () {
                        self._scrollPage();
                    });
                }
            };

            var resizeHandler = function () {

                //  If we’re still waiting for settimeout, reset the timer.
                if (self.resizeTimeout) {
                    clearTimeout(self.resizeTimeout);
                }
                function delayed() {
                    self._scrollPage();
                    self.resizeTimeout = null;
                }

                self.resizeTimeout = setTimeout(delayed, 200);
            };

            // captureScroll
            if (this.docElem == window.document.documentElement) {
                window.addEventListener('scroll', scrollHandler, false);
                window.addEventListener('resize', resizeHandler, false);
            }
            else {
                this.docElem.addEventListener('scroll', scrollHandler, false);
            }

        },

        /*=============================================================================*/

        _scrollPage: function () {
            var self = this;

            this.elems.forEach(function (el, i) {
                self.update(el);
            });
            this.scrolled = false;
        },

        /*=============================================================================*/

        parseLanguage: function (el) {

            //  Splits on a sequence of one or more commas or spaces.
            var words = el.getAttribute('data-scroll-reveal').split(/[, ]+/),
                parsed = {};

            function filter(words) {
                var ret = [],

                    blacklist = [
                        "from",
                        "the",
                        "and",
                        "then",
                        "but",
                        "with"
                    ];

                words.forEach(function (word, i) {
                    if (blacklist.indexOf(word) > -1) {
                        return;
                    }
                    ret.push(word);
                });

                return ret;
            }

            words = filter(words);

            words.forEach(function (word, i) {

                switch (word) {
                    case "enter":
                        parsed.enter = words[i + 1];
                        return;

                    case "after":
                        parsed.after = words[i + 1];
                        return;

                    case "wait":
                        parsed.after = words[i + 1];
                        return;

                    case "move":
                        parsed.move = words[i + 1];
                        return;

                    case "ease":
                        parsed.move = words[i + 1];
                        parsed.ease = "ease";
                        return;

                    case "ease-in":
                        parsed.move = words[i + 1];
                        parsed.easing = "ease-in";
                        return;

                    case "ease-in-out":
                        parsed.move = words[i + 1];
                        parsed.easing = "ease-in-out";
                        return;

                    case "ease-out":
                        parsed.move = words[i + 1];
                        parsed.easing = "ease-out";
                        return;

                    case "over":
                        parsed.over = words[i + 1];
                        return;

                    default:
                        return;
                }
            });

            return parsed;
        },


        /*=============================================================================*/

        update: function (el) {

            var css = this.genCSS(el);
            var style = this.styleBank[el.getAttribute("data-scroll-reveal-id")];

            if (style != null) style += ";"; else style = "";

            if (!el.getAttribute('data-scroll-reveal-initialized')) {
                el.setAttribute('style', style + css.initial);
                el.setAttribute('data-scroll-reveal-initialized', true);
            }

            if (!this.isElementInViewport(el, this.options.viewportFactor)) {
                if (this.options.reset) {
                    el.setAttribute('style', style + css.initial + css.reset);
                }
                return;
            }

            if (el.getAttribute('data-scroll-reveal-complete')) return;

            if (this.isElementInViewport(el, this.options.viewportFactor)) {
                el.setAttribute('style', style + css.target + css.transition);
                //  Without reset enabled, we can safely remove the style tag
                //  to prevent CSS specificy wars with authored CSS.
                if (!this.options.reset) {
                    setTimeout(function () {
                        if (style != "") {
                            el.setAttribute('style', style);
                        } else {
                            el.removeAttribute('style');
                        }
                        el.setAttribute('data-scroll-reveal-complete', true);
                    }, css.totalDuration);
                }
                return;
            }
        },

        /*=============================================================================*/

        genCSS: function (el) {
            var parsed = this.parseLanguage(el),
                enter,
                axis;

            if (parsed.enter) {

                if (parsed.enter == "top" || parsed.enter == "bottom") {
                    enter = parsed.enter;
                    axis = "y";
                }

                if (parsed.enter == "left" || parsed.enter == "right") {
                    enter = parsed.enter;
                    axis = "x";
                }

            } else {

                if (this.options.enter == "top" || this.options.enter == "bottom") {
                    enter = this.options.enter
                    axis = "y";
                }

                if (this.options.enter == "left" || this.options.enter == "right") {
                    enter = this.options.enter
                    axis = "x";
                }
            }

            //  After all values are parsed, let’s make sure our our
            //  pixel distance is negative for top and left entrances.
            //
            //  ie. "move 25px from top" starts at 'top: -25px' in CSS.

            if (enter == "top" || enter == "left") {
                if (parsed.move) {
                    parsed.move = "-" + parsed.move;
                }
                else {
                    parsed.move = "-" + this.options.move;
                }
            }

            var dist = parsed.move || this.options.move,
                dur = parsed.over || this.options.over,
                delay = parsed.after || this.options.after,
                easing = parsed.easing || this.options.easing,
                opacity = parsed.opacity || this.options.opacity;

            var transition = "-webkit-transition: -webkit-transform " + dur + " " + easing + " " + delay + ",  opacity " + dur + " " + easing + " " + delay + ";" +
                "transition: transform " + dur + " " + easing + " " + delay + ", opacity " + dur + " " + easing + " " + delay + ";" +
                "-webkit-perspective: 1000;" +
                "-webkit-backface-visibility: hidden;";

            //  The same as transition, but removing the delay for elements fading out.
            var reset = "-webkit-transition: -webkit-transform " + dur + " " + easing + " 0s,  opacity " + dur + " " + easing + " " + delay + ";" +
                "transition: transform " + dur + " " + easing + " 0s,  opacity " + dur + " " + easing + " " + delay + ";" +
                "-webkit-perspective: 1000;" +
                "-webkit-backface-visibility: hidden;";

            var initial = "-webkit-transform: translate" + axis + "(" + dist + ");" +
                "transform: translate" + axis + "(" + dist + ");" +
                "opacity: " + opacity + ";";

            var target = "-webkit-transform: translate" + axis + "(0);" +
                "transform: translate" + axis + "(0);" +
                "opacity: 1;";
            return {
                transition: transition,
                initial: initial,
                target: target,
                reset: reset,
                totalDuration: ((parseFloat(dur) + parseFloat(delay)) * 1000)
            };
        },

        getViewportH: function () {
            var client = this.docElem['clientHeight'],
                inner = window['innerHeight'];

            if (this.docElem == window.document.documentElement)
                return (client < inner) ? inner : client;
            else
                return client;
        },

        getOffset: function (el) {
            var offsetTop = 0,
                offsetLeft = 0;

            do {
                if (!isNaN(el.offsetTop)) {
                    offsetTop += el.offsetTop;
                }
                if (!isNaN(el.offsetLeft)) {
                    offsetLeft += el.offsetLeft;
                }
            } while (el = el.offsetParent)

            return {
                top: offsetTop,
                left: offsetLeft
            }
        },

        isElementInViewport: function (el, h) {
            var scrolled = this.docElem.scrollTop + this.docElem.offsetTop;
            if (this.docElem == window.document.documentElement)scrolled = window.pageYOffset;
            var
                viewed = scrolled + this.getViewportH(),
                elH = el.offsetHeight,
                elTop = this.getOffset(el).top,
                elBottom = elTop + elH,
                h = h || 0;

            return   (elTop + elH * h) <= viewed
                && (elBottom) >= scrolled
                || (el.currentStyle ? el.currentStyle : window.getComputedStyle(el, null)).position == 'fixed';
        },

        extend: function (a, b) {
            for (var key in b) {
                if (b.hasOwnProperty(key)) {
                    a[key] = b[key];
                }
            }
            return a;
        }
    }; // end scrollReveal.prototype

    return scrollReveal;
})(window);
