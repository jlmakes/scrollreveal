/*
                           ________                       __    _
     ___________________  / / / __ \___ _   _____  ____ _/ /   (_)____
    / ___/ ___/ ___/ __ \/ / / /_/ / _ \ | / / _ \/ __ `/ /   / / ___/
   (__  ) /__/ /  / /_/ / / / _, _/  __/ |/ /  __/ /_/ / /   / (__  )
  /____/\___/_/   \____/_/_/_/ |_|\___/|___/\___/\__,_/_(_)_/ /____/    v3.0.0
                                                          /___/
______________________________________________________________________________*/

// Open source under the MIT license.
// Copyright 2015 Julian Lloyd (@jlmakes) All rights reserved.

window.scrollReveal = (function( window ){

  'use strict';

  var _requestAnimFrame, _extend, _handler, self;

  function scrollReveal( config ){

    self             = this;
    self.elems       = {};
    self.blocked     = false;
    self.defaults    = _extend( self.defaults, config );
    self.initialized = false;
    self.serial      = 1;
    self.viewports   = [ self.defaults.viewport ];

    if ( self.isMobile() && !self.defaults.mobile || !self.isSupported() ){
      self.clean();
    }
  }

  scrollReveal.prototype = {

    defaults: {

      enter:    'bottom',
      move:     '8px',
      over:     '0.6s',
      wait:     '0s',
      easing:   'ease',

      scale:    { direction: 'up', power: '5%' },
      rotate:   { x: 0, y: 0, z: 0 },

      opacity:  0,
      mobile:   false,
      reset:    false,

      //        Expects a reference to a DOM node (the <html> node by default)
      //        which is used as the context when checking element visibility.
      viewport: window.document.documentElement,

      //        'always' — delay every time an animation resets
      //        'onload' - delay only for animations triggered by first load
      //        'once'   — delay only the first time an animation reveals
      delay:    'once',

      //        vFactor changes when an element is considered in the viewport.
      //        The default value of 0.60 means 60% of an element must be
      //        visible for its reveal animation to trigger.
      vFactor:  0.60,

      complete: function( domEl ){} // Note: reset animations do not complete.
    },

    init: function(){

      var viewport, i = 0;

      for ( ; i < self.viewports.length; i++ ){

        viewport = self.viewports[ i ];

        if ( viewport === window.document.documentElement ){

          window.addEventListener( 'scroll', _handler, false );
          window.addEventListener( 'resize', _handler, false );

        } else {
          viewport.addEventListener( 'scroll', _handler, false );
        }
      }

      self.reveal('[data-sr]');
      self.animate();
    },

    // Populates scrollReveal list of elements to be revealed.
    reveal: function( selector, config ){

      var elem, elems, i = 0;

      elems =
        Array
          .prototype
          .slice
          .call( self.defaults.viewport.querySelectorAll( selector ) );

      for ( ; i < elems.length; i++ ){

        elem        = self.elems[ self.serial++ ] = { domEl: elems[ i ] };
        elem.config = self.configFactory( config );
        elem.styles = self.styleFactory( elem );
        elem.seen   = false;

        if ( self.viewports.indexOf( elem.config.viewport ) == -1 ){
          self.viewports.push( elem.config.viewport );
        }

        elem.domEl.removeAttribute('data-sr');

        elem.domEl.setAttribute( 'style',
            elem.styles.inline
          + elem.styles.initial
        );
      }
    },

    // Applies and removes appropriate styles.
    animate: function(){

      var elem, serial, visible;

      // Begin element store digest.
      for ( serial in self.elems ){
        if ( self.elems.hasOwnProperty( serial ) ){

          elem    = self.elems[ serial ];
          visible = self.isElemInViewport( elem );

          if ( visible ){

            elem.seen = true;

            if ( elem.config.delay === 'always'
            || ( elem.config.delay === 'onload' && !self.initialized )
            || ( elem.config.delay === 'once'   && !elem.seen ) ){

              // Use delay.
              elem.domEl.setAttribute( 'style',
                  elem.styles.inline
                + elem.styles.target
                + elem.styles.transition
              );

            } else {

              // Don’t use delay.
              elem.domEl.setAttribute( 'style',
                  elem.styles.inline
                + elem.styles.target
                + elem.styles.reset
              );
            }

            if ( !elem.config.reset && !elem.animating ){
              elem.animating = true;
              complete( serial );
            }

          } else if ( !visible && elem.config.reset ){

            elem.domEl.setAttribute( 'style',
                elem.styles.inline
              + elem.styles.initial
              + elem.styles.reset
            );
          }
        }
      }

      // Digest complete, now un-block the event handler.
      self.initialized = true;
      self.blocked     = false;

      // Prunes completed elements from scrollReveal
      function complete( serial ){

        var elem = self.elems[ serial ];

        setTimeout(function(){

          elem.domEl.setAttribute( 'style', elem.styles.inline );
          elem.config.complete( elem.domEl );
          delete self.elems[ serial ];

        }, elem.styles.duration );
      }
    },

    configFactory: function( data ){

      var words, parsed = {}, config = {}, i = 0;

      if ( !data ){
        config = self.defaults;
      }

      else if ( typeof data === 'object' && data.constructor == Object ){
        config = _extend( self.defaults, data );
      }

      else if ( typeof data === 'string' ){

        words = data.split( /[, ]+/ );
        words.forEach(function( word, i ){
          switch ( word ){

            case 'enter':

              parsed.enter = words[ i + 1 ];
              break;

            case 'wait':

              parsed.wait = words[ i + 1 ];
              break;

            case 'move':

              parsed.move = words[ i + 1 ];
              break;

            case 'ease':

              parsed.move = words[ i + 1 ];
              parsed.ease = 'ease';
              break;

            case 'ease-in':

              if ( words[ i + 1 ] == 'up'
                || words[ i + 1 ] == 'down' ){

                parsed.scale.direction = words[ i + 1 ];
                parsed.scale.power     = words[ i + 2 ];
                parsed.easing          = 'ease-in';
                break;
              }

              parsed.move   = words[ i + 1 ];
              parsed.easing = 'ease-in';
              break;

            case 'ease-in-out':

              if ( words[ i + 1 ] == 'up'
                || words[ i + 1 ] == 'down' ){

                parsed.scale.direction = words[ i + 1 ];
                parsed.scale.power     = words[ i + 2 ];
                parsed.easing          = 'ease-in-out';
                break;
              }

              parsed.move   = words[ i + 1 ];
              parsed.easing = 'ease-in-out';
              break;

            case 'ease-out':

              if ( words[ i + 1 ] == 'up'
                || words[ i + 1 ] == 'down' ){

                parsed.scale.direction = words[ i + 1 ];
                parsed.scale.power     = words[ i + 2 ];
                parsed.easing          = 'ease-out';
                break;
              }

              parsed.move   = words[ i + 1 ];
              parsed.easing = 'ease-out';
              break;

            case 'hustle':

              if ( words[ i + 1 ] == 'up'
                || words[ i + 1 ] == 'down' ){

                parsed.scale.direction = words[ i + 1 ];
                parsed.scale.power     = words[ i + 2 ];
                parsed.easing          = 'cubic-bezier( 0.6, 0.2, 0.1, 1 )';
                break;
              }

              parsed.move   = words[ i + 1 ];
              parsed.easing = 'cubic-bezier( 0.6, 0.2, 0.1, 1 )';
              break;

            case 'over':

              parsed.over = words[ i + 1 ];
              break;

            case 'flip':
            case 'pitch':
              parsed.rotate   = parsed.rotate || {};
              parsed.rotate.x = words[ i + 1 ];
              break;

            case 'spin':
            case 'yaw':
              parsed.rotate   = parsed.rotate || {};
              parsed.rotate.y = words[ i + 1 ];
              break;

            case 'roll':
              parsed.rotate   = parsed.rotate || {};
              parsed.rotate.z = words[ i + 1 ];
              break;

            case 'reset':

              if ( words[ i - 1 ] == 'no' ){
                parsed.reset = false;
              } else {
                parsed.reset = true;
              }
              break;

            case 'scale':

              parsed.scale = {};

              if ( words[ i + 1 ] == 'up'
                || words[ i + 1 ] == 'down' ){

                parsed.scale.direction = words[ i + 1 ];
                parsed.scale.power     = words[ i + 2 ];
                break;
              }

              parsed.scale.power = words[ i + 1 ];
              break;

            case 'vFactor':
            case 'vF':
              parsed.vFactor = words[ i + 1 ];
              break;

            case 'opacity':
              parsed.opacity = words[ i + 1 ];
              break;

            default:
              return;
          }
        });

        config = _extend( self.defaults, parsed );
      }


      if ( config.enter === 'top'
        || config.enter === 'bottom' ){

        config.axis = 'Y';

      } else {
        config.axis = 'X';
      }

      // Let’s make sure our our pixel distances are negative for top and left.
      // e.g. "enter top and move 25px" starts at 'top: -25px' in CSS.
      if ( config.enter === 'top'
        || config.enter === 'left' ){

        config.move = '-' + config.move;
      }

      return config;
    },

    // Generates styles based on an elements configuration property.
    // @param {object} elem — An object from self.elems.
    // @return {object}
    styleFactory: function( elem ){

      var inline;
      var initial;
      var reset;
      var target;
      var transition;

      var cfg      = elem.config;
      var duration = ( parseFloat( cfg.over ) + parseFloat( cfg.wait ) ) * 1000;

      // Want to disable delay on mobile devices? Uncomment the line below.
      // if ( self.isMobile() && self.defaults.mobile ) cfg.wait = 0;

      if ( elem.domEl.getAttribute('style') ){
        inline = elem.domEl.getAttribute('style') + '; visibility: visible; ';
      } else {
        inline = 'visibility: visible; ';
      }

      transition = '-webkit-transition: -webkit-transform ' + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + ', opacity ' + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + '; ' +
                           'transition: transform '         + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + ', opacity ' + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + '; ' +
                  '-webkit-perspective: 1000;' +
          '-webkit-backface-visibility: hidden;';

      reset      = '-webkit-transition: -webkit-transform ' + cfg.over + ' ' + cfg.easing + ' 0s, opacity ' + cfg.over + ' ' + cfg.easing + ' 0s; ' +
                           'transition: transform '         + cfg.over + ' ' + cfg.easing + ' 0s, opacity ' + cfg.over + ' ' + cfg.easing + ' 0s; ' +
                  '-webkit-perspective: 1000; ' +
          '-webkit-backface-visibility: hidden; ';

      initial = 'transform:';
      target  = 'transform:';
      build();

      // Build again for webkit…
      initial += '-webkit-transform:';
      target  += '-webkit-transform:';
      build();

      return {
        transition: transition,
        initial:    initial,
        target:     target,
        reset:      reset,
        inline:     inline,
        duration:   duration
      };

      // Constructs initial and target styles.
      function build(){

        if ( parseInt( cfg.move ) !== 0 ){
          initial += ' translate' + cfg.axis + '(' + cfg.move + ')';
          target  += ' translate' + cfg.axis + '(0)';
        }

        if ( parseInt( cfg.scale.power ) !== 0 ){

          if ( cfg.scale.direction === 'up' ){
            cfg.scale.value = 1 - ( parseFloat( cfg.scale.power ) * 0.01 );
          } else if ( cfg.scale.direction === 'down' ){
            cfg.scale.value = 1 + ( parseFloat( cfg.scale.power ) * 0.01 );
          }

          initial += ' scale(' + cfg.scale.value + ')';
          target  += ' scale(1)';
        }

        if ( cfg.rotate.x ){
          initial += ' rotateX(' + cfg.rotate.x + ')';
          target  += ' rotateX(0)';
        }

        if ( cfg.rotate.y ){
          initial += ' rotateY(' + cfg.rotate.y + ')';
          target  += ' rotateY(0)';
        }

        if ( cfg.rotate.z ){
          initial += ' rotateZ(' + cfg.rotate.z + ')';
          target  += ' rotateZ(0)';
        }

        initial += '; opacity: ' + cfg.opacity + '; ';
        target  += '; opacity: 1; ';
      }
    },

    getViewportH: function( viewport ){

      var client   = viewport['clientHeight'];
      var inner    = window['innerHeight'];

      if ( viewport === window.document.documentElement ){
        return ( client < inner ) ? inner : client;
      }

      return client;
    },

    scrollY: function( elem ){

      var viewport = elem.config.viewport;

      if ( viewport === window.document.documentElement ){
        return window.pageYOffset;
      } else {
        return viewport.scrollTop + viewport.offsetTop;
      }
    },

    getOffset: function( domEl ){

      var offsetTop  = 0;
      var offsetLeft = 0;

      do {
        if ( !isNaN( domEl.offsetTop ) ){
          offsetTop  += domEl.offsetTop;
        }
        if ( !isNaN( domEl.offsetLeft ) ){
          offsetLeft += domEl.offsetLeft;
        }
      } while ( domEl = domEl.offsetParent );

      return {
        top: offsetTop,
        left: offsetLeft
      };
    },

    isElemInViewport: function( elem ){

      var elHeight = elem.domEl.offsetHeight;
      var elTop    = self.getOffset( elem.domEl ).top;
      var elBottom = elTop + elHeight;
      var vFactor  = elem.config.vFactor || 0;

      return ( confirmBounds() || isPositionFixed() );

      function confirmBounds(){

        var top        = elTop + elHeight * vFactor;
        var bottom     = elBottom - elHeight * vFactor;
        var viewBottom = self.scrollY( elem ) + self.getViewportH( elem.config.viewport );
        var viewTop    = self.scrollY( elem );

        return ( top < viewBottom ) && ( bottom > viewTop );
      }

      function isPositionFixed(){

        var style = elem.domEl.currentStyle || window.getComputedStyle( elem.domEl, null );

        return style.position === 'fixed';
      }
    },

    isMobile: function(){

      var agent = navigator.userAgent || navigator.vendor || window.opera;

      return (/(ipad|playbook|silk|android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test( agent )||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( agent.substr( 0, 4 ))) ? true : false;
    },

    isSupported: function(){

      var sensor    = document.createElement('sensor');
      var cssPrefix = 'Webkit,Moz,O,'.split(',');
      var tests     = ( 'transition ' + cssPrefix.join('transition,') ).split(',');

      for ( var i = 0; i < tests.length; i++ ){
        if ( !sensor.style[tests[i]] === '' ){
          return false;
        }
      }

      return true;
    },

    clean: function(){
      for ( var i = 0; i < self.elems.length; i++ ){
        self.elems[ i ].domEl.removeAttribute('data-sr');
      }
    }
  } // End of the scrollReveal prototype ======================================|

  _handler = function( e ){

    if ( !self.blocked ){

      self.blocked  = true;

      _requestAnimFrame(function(){
        self.animate();
      });
    }
  }

  _extend = function( target, src ){

    for ( var prop in src ){
      if ( src.hasOwnProperty( prop ) ){
        target[ prop ] = src[ prop ];
      }
    }

    return target;
  }

  // RequestAnimationFrame polyfill.
  _requestAnimFrame = (function(){

    return window.requestAnimationFrame        ||
           window.webkitRequestAnimationFrame  ||
           window.mozRequestAnimationFrame     ||

          function( callback ){
            window.setTimeout( callback, 1000 / 60 );
          };
  }());

  return scrollReveal;

})( window );
