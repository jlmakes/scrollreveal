/*
                           ________                       __    _
     ___________________  / / / __ \___ _   _____  ____ _/ /   (_)____
    / ___/ ___/ ___/ __ \/ / / /_/ / _ \ | / / _ \/ __ `/ /   / / ___/
   (__  ) /__/ /  / /_/ / / / _, _/  __/ |/ /  __/ /_/ / /   / (__  )
  /____/\___/_/   \____/_/_/_/ |_|\___/|___/\___/\__,_/_(_)_/ /____/    v3.0.0
                                                         /___/
________________________________________________________________________________

----  Copyright 2015 Julian Lloyd (@jlmakes) Open source under MIT license  ----
______________________________________________________________________________*/

window.scrollReveal = (function( window ){

  'use strict';

  var _requestAnimFrame
    , _extend
    , _extendClone
    , _handler
    , _isDOMElement
    , _updateElemStore
    , self;

  function scrollReveal( config ){

    self = this;

    _extend( self.defaults, config );

    if ( self.isMobile() && !self.defaults.mobile || !self.isSupported() ){
      self.clean();
      return null;
    }

    self.store = {
      elements:  {}, // Element store to manage styles.
      viewports: []  // Viewport store to manage event binding.
    };

    self.serial      = 1;     // Primary key for element store.
    self.blocked     = false; // Flag used to throttle scroll events.
    self.initialized = false; // Flag used for 'onload' delay styles.
  }



  scrollReveal.prototype.defaults = {

    enter:    'bottom',
    move:     '8px',
    over:     '0.6s',
    wait:     '0s',
    easing:   'ease',

    scale:    { direction: 'up', power: '5%' },
    rotate:   { x: 0, y: 0, z: 0 },

    opacity:  0,
    mobile:   true,
    reset:    false,

    //        Expects a reference to a DOM node (the <html> node by default)
    //        which is used as the context when checking element visibility.
    viewport: window.document.documentElement,

    //        'always' — Delay every time an animation resets.
    //        'onload' - Delay only for animations triggered by first load.
    //        'once'   — Delay only the first time an animation reveals.
    delay:    'once',

    //        vFactor changes when an element is considered in the viewport.
    //        The default value of 0.60 means 60% of an element must be
    //        visible for its reveal animation to trigger.
    vFactor:  0.60,

    complete: function( domEl ){} // Note: reset animations will not "complete".
  };



  scrollReveal.prototype.init = function(){

    var viewport;

    // Register any inline ScrollReveal instructions.

    self.reveal.call( self.init, '[data-sr]' );

    // Go through the viewport store, and bind event listeners.

    for ( var i = 0; i < self.store.viewports.length; i++ ){

      viewport = self.store.viewports[ i ];

      if ( viewport === window.document.documentElement ){

        window.addEventListener( 'scroll', _handler, false );

      } else {

        viewport.addEventListener( 'scroll', _handler, false );
      }
    }

    window.addEventListener( 'resize', _handler, false );
    self.animate();

    return self;
  };



  scrollReveal.prototype.reveal = function( selector, config ){

    var elem, elems, viewport;

    if ( selector == '[data-sr]' && this != self.init ){
      return console.warn('reveal(): invalid selector [data-sr] (reserved by system)');
    }

    if ( config && config.viewport ){

      viewport = config.viewport;

    } else {

      viewport = self.defaults.viewport;
    }

    elems =
      Array
        .prototype
        .slice
        .call( viewport.querySelectorAll( selector ) );

    // If no elements are found, display warning message in console and exit.

    if ( elems.length == 0 && selector != '[data-sr]' ){
      console.warn( selector + " inside " + config.viewport + " returned 0 elements." );
      return
    }

    for ( var i = 0; i < elems.length; i++ ){

      var elem = {}
        , id   = elems[ i ].getAttribute('data-sr-id');

      if ( id ){

        // If we find an element, populate our element
        // with the object at that key in the data store.

        elem = self.store.elements[ id ];
      }

      else {

        // Otherwise, create a new element.

        elem.domEl = elems[ i ];
        elem.id    = self.serial++;
        elem.seen  = false;

        elem.domEl.setAttribute( 'data-sr-id', elem.id );
      }

      // Now that we have an element, let’s update its
      // stored configuration and styles.

      if ( this == self.init ){

        elem.config = self.configFactory( elem.domEl.getAttribute('data-sr'), elem.config );
        elem.domEl.removeAttribute('data-sr');

      } else {

        elem.config = self.configFactory( config, elem.config );
      }

      elem.styles = self.styleFactory( elem );

      elem.domEl.setAttribute( 'style',
          elem.styles.inline
        + elem.styles.initial
      );

      _updateElemStore( elem );
    }

    return self;
  };



  scrollReveal.prototype.animate = function(){

    var elem
      , key
      , visible;

    // Begin element store digest.

    for ( key in self.store.elements ){
      if ( self.store.elements.hasOwnProperty( key ) ){

        elem    = self.store.elements[ key ];
        visible = self.isElemVisible( elem );

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

          // Our element is still animating, so lets trigger our callback.

          if ( !elem.config.reset && !elem.animating ){
            elem.animating = true;
            complete( key );
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

    // Prunes completed elements from scrollReveal.
    // TODO: Look into clearing lingering setTimeouts.

    function complete( key ){

      var elem = self.store.elements[ key ];

      setTimeout(function(){

        elem.domEl.setAttribute( 'style', elem.styles.inline );
        elem.domEl.removeAttribute( 'data-sr-id' );
        elem.config.complete( elem.domEl );
        delete self.store.elements[ key ];

      }, elem.styles.duration );
    }
  };



  scrollReveal.prototype.configFactory = function( config, context ){

    // The default configuration is the default context, but in instances
    // where we call sr.reveal() more than once on the same element set
    // (perhaps to re-configure or override), we need to set the context
    // to the element’s existing styles

    var words
      , parsed = {};

    // Confirm our context

    if ( context == null ){

      context = self.defaults;

    } else if ( context && typeof context !== 'object' || context.constructor != Object ){

      context = self.defaults;
      console.warn('configFactory: Invalid context object.')
    }

    // Confirm configuration

    if ( config == null ) {

      config = context;

    } else if ( typeof config === 'object' && config.constructor == Object ){

      config = _extendClone( context, config );

    } else if ( typeof config === 'string' ){

      words = config.split( /[, ]+/ );
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

      config = _extendClone( context, parsed );
    }

    // Now let’s prepare the configuration for CSS

    if ( config.easing == 'hustle' ){
      config.easing = 'cubic-bezier( 0.6, 0.2, 0.1, 1 )';
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
  };



  scrollReveal.prototype.styleFactory = function( elem ){

    var initial
      , reset
      , target
      , transition

      , config   = elem.config
      , inline   = elem.domEl.getAttribute('style')
      , duration = ( parseFloat( config.over ) + parseFloat( config.wait ) ) * 1000;

    // You can customize ScrollReveal with mobile-only logic here, for example,
    // change the starting opacity, or remove animation delay.

    if ( self.isMobile() && self.defaults.mobile ){
      // Stuff...
    }

    // Since JavaScript runs after the page has begun rendering, it’s possible
    // that elements will be seen before ScrollReveal can hide them during
    // initialization.

    // One technique is to apply `visibility: hidden` via CSS to your elements
    // so they load hidden, allowing ScrollReveal to overwrite visibility here.
    // TODO: Add link to Wiki tips section

    if ( inline ) inline += '; visibility: visible; ';
    else          inline = 'visibility: visible; ';

    // Build unprefixed and webkit transition styles.

    transition = '-webkit-transition: -webkit-transform ' + config.over + ' ' + config.easing + ' ' + config.wait + ', opacity ' + config.over + ' ' + config.easing + ' ' + config.wait + '; ' +
                         'transition: transform '         + config.over + ' ' + config.easing + ' ' + config.wait + ', opacity ' + config.over + ' ' + config.easing + ' ' + config.wait + '; ' +
                '-webkit-perspective: 1000;' +
        '-webkit-backface-visibility: hidden;';

    // Build alternate transition styles with no delay, for animation resets.

    reset      = '-webkit-transition: -webkit-transform ' + config.over + ' ' + config.easing + ' 0s, opacity ' + config.over + ' ' + config.easing + ' 0s; ' +
                         'transition: transform '         + config.over + ' ' + config.easing + ' 0s, opacity ' + config.over + ' ' + config.easing + ' 0s; ' +
                '-webkit-perspective: 1000; ' +
        '-webkit-backface-visibility: hidden; ';

    // Create initial and target animation styles.

    initial = 'transform:';
    target  = 'transform:';

    generateStyles();

    // Create initial and target animation styles again, for webkit browsers.

    initial += '-webkit-transform:';
    target  += '-webkit-transform:';

    generateStyles();

    return {
      transition: transition,
      initial:    initial,
      target:     target,
      reset:      reset,
      inline:     inline,
      duration:   duration
    };

    function generateStyles(){

      if ( parseInt( config.move ) !== 0 ){
        initial += ' translate' + config.axis + '(' + config.move + ')';
        target  += ' translate' + config.axis + '(0)';
      }

      if ( parseInt( config.scale.power ) !== 0 ){

        if ( config.scale.direction === 'up' ){
          config.scale.value = 1 - ( parseFloat( config.scale.power ) * 0.01 );
        }

        else if ( config.scale.direction === 'down' ){
          config.scale.value = 1 + ( parseFloat( config.scale.power ) * 0.01 );
        }

        initial += ' scale(' + config.scale.value + ')';
        target  += ' scale(1)';
      }

      if ( config.rotate.x ){
        initial += ' rotateX(' + config.rotate.x + ')';
        target  += ' rotateX(0)';
      }

      if ( config.rotate.y ){
        initial += ' rotateY(' + config.rotate.y + ')';
        target  += ' rotateY(0)';
      }

      if ( config.rotate.z ){
        initial += ' rotateZ(' + config.rotate.z + ')';
        target  += ' rotateZ(0)';
      }

      initial += '; opacity: ' + config.opacity + '; ';
      target  += '; opacity: 1; ';
    }
  };



  scrollReveal.prototype.getViewportHeight = function( viewport ){

    var client = viewport['clientHeight'];
    var inner  = window['innerHeight'];

    if ( viewport === window.document.documentElement ){
      return ( client < inner ) ? inner : client;
    }

    return client;
  };



  scrollReveal.prototype.getScrolled = function( viewport ){

    if ( viewport === window.document.documentElement ){
      return window.pageYOffset;
    } else {
      return viewport.scrollTop + viewport.offsetTop;
    }
  };



  scrollReveal.prototype.getOffset = function( domEl ){

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
  };



  scrollReveal.prototype.isElemVisible = function( elem ){

    var elHeight = elem.domEl.offsetHeight
      , elTop    = self.getOffset( elem.domEl ).top
      , elBottom = elTop + elHeight
      , vFactor  = elem.config.vFactor
      , viewport = elem.config.viewport;

    return ( confirmBounds() || isPositionFixed() );

    function confirmBounds(){

      var top        = elTop + elHeight * vFactor
        , bottom     = elBottom - elHeight * vFactor
        , viewTop    = self.getScrolled( viewport )
        , viewBottom = viewTop + self.getViewportHeight( viewport );

      return ( top < viewBottom ) && ( bottom > viewTop );
    }

    function isPositionFixed(){
      var style = elem.domEl.currentStyle || window.getComputedStyle( elem.domEl, null );
      return style.position === 'fixed';
    }
  };



  scrollReveal.prototype.isMobile = function(){

    var agent = navigator.userAgent || navigator.vendor || window.opera;

    return (/(ipad|playbook|silk|android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test( agent )||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( agent.substr( 0, 4 ))) ? true : false;
  };



  scrollReveal.prototype.isSupported = function(){

    var sensor    = document.createElement('sensor')
      , cssPrefix = 'Webkit,Moz,O,'.split(',')
      , tests     = ( 'transition ' + cssPrefix.join('transition,') ).split(',');

    for ( var i = 0; i < tests.length; i++ ){
      if ( !sensor.style[ tests[ i ] ] === '' ){
        return false;
      }
    }

    return true;
  };



  scrollReveal.prototype.clean = function(){
    for ( var key in self.store.elements ){
      if ( self.store.elements.hasOwnProperty( key ) ){
        self.store.elements[ key ].domEl.removeAttribute('data-sr data-sr-id');
      }
    }
  };

// Private Methods /////////////////////////////////////////////////////////////

  _updateElemStore = function( elem ){

    self.store.elements[ elem.id ] = elem;

    if ( self.store.viewports.indexOf( elem.config.viewport ) == -1 ){
      self.store.viewports.push( elem.config.viewport );
    }
  };

  _handler = function( e ){

    if ( !self.blocked ){

      self.blocked = true;
      _requestAnimFrame( self.animate );
    }
  };

  _extend = function( target, src ){

    for ( var prop in src ){
      if ( src.hasOwnProperty( prop ) ){
        target[ prop ] = src[ prop ];
      }
    }

    return target;
  };

  _extendClone = function( target, src ){

    var clone = {};

    for ( var prop in target ){
      if ( target.hasOwnProperty( prop ) ){
        clone[ prop ] = target[ prop ];
      }
    }

    for ( var prop in src ){
      if ( src.hasOwnProperty( prop ) ){
        clone[ prop ] = src[ prop ];
      }
    }

    return clone;
  };

  _isDOMElement = function( obj ){
    return (
      typeof HTMLElement === "object" ? obj instanceof HTMLElement : // DOM2
      obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName==="string"
    );
  };

  // Polyfill //////////////////////////////////////////////////////////////////

  _requestAnimFrame = (function(){

    return window.requestAnimationFrame        ||
           window.webkitRequestAnimationFrame  ||
           window.mozRequestAnimationFrame     ||

          function( callback ){
            window.setTimeout( callback, 1000 / 60 );
          };
  }());

  //////////////////////////////////////////////////////////////////////////////

  return scrollReveal;

})( window );
