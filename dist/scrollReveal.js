
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.scrollReveal = factory();
  }
}(this, function(require, exports, module) {

/*
                       _ _ _____                      _   _
                      | | |  __ \                    | | (_)
    ___  ___ _ __ ___ | | | |__) |_____   _____  __ _| |  _ ___
   / __|/ __| '__/ _ \| | |  _  // _ \ \ / / _ \/ _` | | | / __|
   \__ \ (__| | | (_) | | | | \ \  __/\ V /  __/ (_| | |_| \__ \
   |___/\___|_|  \___/|_|_|_|  \_\___| \_/ \___|\__,_|_(_) |___/ v2.0.0
                                                        _/ |
                                                       |__/

============================================================================*/

/**
 * scrollReveal.js (c) 2014 Julian Lloyd ( @julianlloyd )
 *
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */

window.scrollReveal = (function( window ) {

  'use strict'

  var _requestAnimFrame
    , extend
    , handler
    , self

  function scrollReveal( config ) {

      self         = this
      self.elems   = {}
      self.serial  = 1
      self.blocked = false
      self.config  = extend( self.defaults, config )

      if ( self.isMobile() && !self.config.mobile ) return

      window.addEventListener( 'scroll', handler, false )
      window.addEventListener( 'resize', handler, false )

      self.init()
  }

  scrollReveal.prototype = {

    defaults: {

      enter:    'bottom',
      move:     '8px',
      over:     '0.6s',
      wait:     '0s',
      easing:   'ease',

      scale:    { direction: 'up', power: '5%' },

      opacity:  0,
      mobile:   false,
      reset:    false,
      viewport: window.document.documentElement, // <HTML> element by default.

      /**
       *        'always' — delay every time an animation resets
       *        'once'   — delay only the first time an animation reveals
       *        'onload' - delay only for animations triggered by self.init()
       */
      delay:    'once',

      /**
       *        vFactor changes when an element is considered in the viewport;
       *        the default requires 60% of an element be visible.
       */
      vFactor:  0.60,

      complete: function( el ) {} // Note: reset animations do not complete.
    },

    init: function() {

      var id
        , elem
        , query

      query = Array.prototype.slice.call( self.config.viewport.querySelectorAll( '[data-sr]' ) )
      query.forEach(function ( el ) {

        id = self.serial++

        /**
         * If no data-sr-id attribute is found, begin assembling
         * a new object for our self.elems array.
         */
        if ( !el.getAttribute( 'data-sr-id' ) ) {

          el.setAttribute( 'data-sr-id', id )

          elem        = self.elems[ id ] = { domEl: el }
          elem.config = self.configFactory( elem )
          elem.styles = self.styleFactory( elem )
          elem.seen   = false
        }

        /**
         * Everything is setup, so add the initial styles.
         */
        el.setAttribute( 'style', elem.styles.inline + elem.styles.initial )

        return
      })

      self.scrolled = self.scrollY()
      self.animate( true )
    },

    animate: function( flag ) {

      var elem

      for ( var id in self.elems ) {

        elem = self.elems[ id ]

        /**
         * First, let’s skip any (non-reseting) elements that have completed their reveal.
         */
        if ( elem.domEl.getAttribute( 'data-sr-complete' ) ) {

          delete self.elems[ id ]
          continue
        }

        /**
         * If our element is visible, run through config.
         */
        if ( self.isElemInViewport( elem ) ) {

          if ( self.config.delay == 'always'
          || ( self.config.delay == 'onload' && flag )
          || ( self.config.delay == 'once' && !elem.seen ) ) {

            elem.domEl.setAttribute( 'style',

                elem.styles.inline
              + elem.styles.target
              + elem.styles.transition
            )

            elem.seen = true

          } else {

            elem.domEl.setAttribute( 'style',

                elem.styles.inline
              + elem.styles.target
              + elem.styles.reset
            )
          }

          if ( self.config.delay == 'once' )

          /**
           * Reset is disabled for this element, so lets restore the style attribute
           * to its pre-scrollReveal state after the animation completes.
           */
          if ( !elem.config.reset ) {

            setTimeout(function () {

              /**
               * Reset inline styles and fire callback.
               */
              elem.domEl.setAttribute( 'style', elem.styles.inline )
              elem.domEl.setAttribute( 'data-sr-complete', true )
              elem.config.complete( elem.docEl )
              /**
               * Reveal animation complete.
               */

            }, elem.styles.duration )
          }

          continue

        }

        if ( !self.isElemInViewport( elem ) ) {

          /**
           * The element isn’t visible, so check if we should apply reset styles.
           */
          if ( elem.config.reset ) {

            elem.domEl.setAttribute( 'style',

                elem.styles.inline
              + elem.styles.initial
              + elem.styles.reset
            )
          }

          continue
        }
      }

      self.blocked = false
    },

    configFactory: function( elem ) {

      var parsed = {}
        , config = {}
        , words  = elem.domEl.getAttribute( 'data-sr' ).split( /[, ]+/ )

      /**
       * Find and remove any syntax sugar.
       */
      words = self.filter( words )
      words.forEach(function( keyword, i ) {

        /**
         * Find keywords.
         */
        switch ( keyword ) {

          case 'enter':

            parsed.enter = words[ i + 1 ]
            return

          case 'wait':

            parsed.wait = words[ i + 1 ]
            return

          case 'move':

            parsed.move = words[ i + 1 ]
            return

          case 'ease':

            parsed.move = words[ i + 1 ]
            parsed.ease = 'ease'
            return

          case 'ease-in':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ) {

              parsed.scale.direction = words[ i + 1 ]
              parsed.scale.power     = words[ i + 2 ]
              parsed.easing          = 'ease-in'
              return
            }

            parsed.move   = words[ i + 1 ]
            parsed.easing = 'ease-in'
            return

          case 'ease-in-out':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ) {

              parsed.scale.direction = words[ i + 1 ]
              parsed.scale.power     = words[ i + 2 ]
              parsed.easing          = 'ease-in-out'
              return
            }

            parsed.move   = words[ i + 1 ]
            parsed.easing = 'ease-in-out'
            return

          case 'ease-out':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ) {

              parsed.scale.direction = words[ i + 1 ]
              parsed.scale.power     = words[ i + 2 ]
              parsed.easing          = 'ease-out'
              return
            }

            parsed.move   = words[ i + 1 ]
            parsed.easing = 'ease-out'
            return

          case 'hustle':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ) {

              parsed.scale.direction = words[ i + 1 ]
              parsed.scale.power     = words[ i + 2 ]
              parsed.easing          = 'cubic-bezier( 0.6, 0.2, 0.1, 1 )'
              return
            }

            parsed.move   = words[ i + 1 ]
            parsed.easing = 'cubic-bezier( 0.6, 0.2, 0.1, 1 )'
            return

          case 'over':

            parsed.over = words[ i + 1 ]
            return

          case 'reset':

            if ( words[ i - 1 ] == 'no' ) parsed.reset = false
            else                          parsed.reset = true

            return

          case 'scale':

            parsed.scale = {}

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ) {

              parsed.scale.direction = words[ i + 1 ]
              parsed.scale.power     = words[ i + 2 ]
              return
            }

            parsed.scale.power = words[ i + 1 ]
            return

          default:
            return
        }
      })

      /**
       * Build config object from defaults and element
       * overrides parsed from the data-sr attribute.
       */
      config = extend( config, self.config )
      config = extend( config, parsed )

      if ( config.enter  == 'top'  || config.enter == 'bottom' ) config.axis = 'Y'
      if ( config.enter  == 'left' || config.enter == 'right'  ) config.axis = 'X'

      /**
       * Make sure to check for our custom hustle easing
       */
      if ( config.easing == 'hustle' ) config.easing = 'cubic-bezier( 0.6, 0.2, 0.1, 1 )'

      /**
       * Let’s make sure our our pixel distances are negative for top and left.
       * e.g. "move 25px from top" starts at 'top: -25px' in CSS.
       */
      if ( config.enter == 'top' || config.enter == 'left' ) config.move = '-' + config.move

      return config

    },

    styleFactory: function( elem ) {

      var transition
        , initial
        , target
        , reset
        , inline
        , build

      inline = ( elem.domEl.getAttribute( 'style' ) ) ? elem.domEl.getAttribute( 'style' ) + '; visibility: visible; ' : 'visibility: visible; '

      /**
       * Want to disable delay on mobile devices? (uncomment the line below)
       */
      //if ( self.isMobile() && self.config.mobile ) elem.config.wait = 0

      transition = '-webkit-transition: -webkit-transform ' + elem.config.over + ' ' + elem.config.easing + ' ' + elem.config.wait + ', opacity ' + elem.config.over + ' ' + elem.config.easing + ' ' + elem.config.wait + '; ' +
                           'transition: transform '         + elem.config.over + ' ' + elem.config.easing + ' ' + elem.config.wait + ', opacity ' + elem.config.over + ' ' + elem.config.easing + ' ' + elem.config.wait + '; ' +
                  '-webkit-perspective: 1000;' +
          '-webkit-backface-visibility: hidden;'

      reset      = '-webkit-transition: -webkit-transform ' + elem.config.over + ' ' + elem.config.easing + ' 0s, opacity ' + elem.config.over + ' ' + elem.config.easing + ' 0s; ' +
                           'transition: transform '         + elem.config.over + ' ' + elem.config.easing + ' 0s, opacity ' + elem.config.over + ' ' + elem.config.easing + ' 0s; ' +
                  '-webkit-perspective: 1000; ' +
          '-webkit-backface-visibility: hidden; '

      /**
       * Construct initial and target styles.
       */
      build = function( flag ) {

        initial = 'transform:'
        target  = 'transform:'

        if ( parseInt( elem.config.move ) != 0 ) {

          initial += ' translate' + elem.config.axis + '(' + elem.config.move + ')'
          target  += ' translate' + elem.config.axis + '(0)'
        }

        if ( parseInt( elem.config.scale.power ) != 0 ) {

          if ( elem.config.scale.direction == 'up'   ) elem.config.scale.value = 1 - ( parseFloat( elem.config.scale.power ) * 0.01 )
          if ( elem.config.scale.direction == 'down' ) elem.config.scale.value = 1 + ( parseFloat( elem.config.scale.power ) * 0.01 )

          initial += ' scale(' + elem.config.scale.value + ')'
          target  += ' scale(1)'
        }

        initial += '; opacity: ' + elem.config.opacity + '; '
        target  += '; opacity: 1; ';

        if ( flag ) {

          initial += '-webkit-transform:'
          target  += '-webkit-transform:'

          build( false )
        }
      }

      build()

      return {

        transition: transition,
        initial:    initial,
        target:     target,
        reset:      reset,
        inline:     inline,
        duration:   ( ( parseFloat( elem.config.over ) + parseFloat( elem.config.wait ) ) * 1000 )
      }
    },

    filter: function( words ) {

      var filtered  = []

      var sugar = [

        'from',
        'the',
        'and',
        'then',
        'but',
        'with',
        'please',
      ]

      words.forEach(function( word ) {

        if ( sugar.indexOf( word ) > -1 ) return

        filtered.push( word )
        return
      })

      return filtered
    },

    getViewportH: function() {

      var client = self.config.viewport[ 'clientHeight' ]
        , inner  = window[ 'innerHeight' ]

      if ( self.config.viewport == window.document.documentElement ) return ( client < inner ) ? inner : client

      return client
    },

    scrollY: function() {

      if ( self.config.viewport == window.document.documentElement ) return window.pageYOffset

      return self.config.viewport.scrollTop + self.config.viewport.offsetTop
    },

    getOffset: function( el ) {

      var offsetTop  = 0
        , offsetLeft = 0

      do {

        if ( !isNaN( el.offsetTop  )) offsetTop  += el.offsetTop
        if ( !isNaN( el.offsetLeft )) offsetLeft += el.offsetLeft

      } while ( el = el.offsetParent )

      return {

        top: offsetTop,
        left: offsetLeft
      }
    },

    isElemInViewport: function( elem ) {

      var elHeight = elem.domEl.offsetHeight
        , elTop    = self.getOffset( elem.domEl ).top
        , elBottom = elTop + elHeight
        , vFactor     = elem.config.vFactor || 0

      return ( elTop + elHeight * vFactor < self.scrolled + self.getViewportH() )
          && ( elBottom - elHeight * vFactor > self.scrolled )
          || ( elem.domEl.currentStyle ? elem.domEl.currentStyle : window.getComputedStyle( elem.domEl, null ) ).position == 'fixed'
    },

    isMobile: function() {

      var agent = navigator.userAgent || navigator.vendor || window.opera

      return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test( agent )||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( agent.substr( 0, 4 ))) ? true : false
    },

  }

  handler = function( e ) {

    if ( !self.blocked ) {

      self.blocked  = true
      self.scrolled = self.scrollY()

      _requestAnimFrame( function() {

        self.animate()
      })
    }
  }

  extend = function( a, b ) {

    for ( var key in b ) {

      if ( b.hasOwnProperty( key ) ) {

        a[ key ] = b[ key ]
      }
    }

    return a
  }

  /**
   * RequestAnimationFrame polyfill.
   */
  _requestAnimFrame = (function () {

    return window.requestAnimationFrame        ||
           window.webkitRequestAnimationFrame  ||
           window.mozRequestAnimationFrame     ||

          function( callback ) {

            window.setTimeout( callback, 1000 / 60 )
          }
  }())

  return scrollReveal

})( window )

return scrollReveal;

}));
