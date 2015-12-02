/*
           _____                 ________                       __
          / ___/______________  / / / __ \___ _   _____  ____ _/ /
          \__ \/ ___/ ___/ __ \/ / / /_/ / _ \ | / / _ \/ __ `/ /
         ___/ / /__/ /  / /_/ / / / _, _/  __/ |/ /  __/ /_/ / /
        /____/\___/_/   \____/_/_/_/ |_|\___/|___/\___/\__,_/_/   v3.0.0

________________________________________________________________________________

      Copyright 2015 Julian Lloyd (@jlmakes) Open source under MIT license
______________________________________________________________________________*/

window.ScrollReveal = (function( window ){

  'use strict';

  var _requestAnimFrame
    , _extend
    , _extendClone
    , _handler
    , _isNode
    , _isObject
    , _updateElemStore
    , self;

  function ScrollReveal( config ){

    self = this;

    _extend( self.defaults, config );

    if ( self.isMobile() && !self.defaults.mobile || !self.isSupported() ){

      // Remove any data-sr attributes found in the DOM and abort

      self.cleanDOM();
      console.warn('ScrollReveal instantiation aborted.');
      return null;
    }

    self.store = {
      elements:  {}, // Element store to manage styles
      viewports: []  // Viewport store to manage event binding
    };

    self.serial      = 1;     // Primary key for element store
    self.blocked     = false; // Flag used to throttle scroll events
    self.initialized = false; // Flag used for 'onload' delay styles
  }



  ScrollReveal.prototype.defaults = {

    enter:       'bottom', // top, right, bottom, left
    move:        '0px',
    over:        '0.6s',
    wait:        '0s',
    easing:      'hustle', // ease, easeIn, easeOut, easeInOut, hustle, linear

    scale:       { direction: 'up', power: '10%' }, // up, down
    rotate:      { x: 0, y: 0, z: 0 },

    opacity:     0,    // The starting opacity for reveal animations.
    mobile:      true, // Controls whether or not reveals occur on mobile

    //           Controls whether or not reveal animations play each time the
    //           element enters its viewport, or just once
    reset:       false,

    //           Expects a reference to a DOM node (the <html> node by default)
    //           which is used as the context when checking element visibility
    viewport:    window.document.documentElement,

    //           'always' — Delay every time an animation resets
    //           'onload' - Delay only for animations triggered by first load
    //           'once'   — Delay only the first time an animation reveals
    delay:       'once',

    //           vFactor changes when an element is considered in the viewport
    //           The default value of 0.35 means 35% of an element must be
    //           visible for its reveal animation to trigger
    vFactor:     0.35,

    //           Callbacks:
    afterReveal: function( domEl ){},
    afterReset:  function( domEl ){}
  };



  ScrollReveal.prototype.init = function(){

    var viewport;

    self.animate();

    // Go through the viewport store, and bind event listeners

    for ( var i = 0; i < self.store.viewports.length; i++ ){

      viewport = self.store.viewports[ i ];

      if ( viewport === window.document.documentElement ){
        window.addEventListener( 'scroll', _handler, true );
      } else {
        viewport.addEventListener( 'scroll', _handler, true );
      }
    }

    if ( !self.initialized ){
      window.addEventListener( 'resize', _handler, true );
      self.initialized = true;
    }

    return self;
  };



  ScrollReveal.prototype.reveal = function( selector, config ){

    var elem, elems, viewport;

    if ( config && config.viewport ){
      viewport = config.viewport;
    } else {
      viewport = self.defaults.viewport;
    }

    if ( _isNode( selector ) ){
      elems = [ selector ];
    } else {
      elems = Array.prototype.slice.call( viewport.querySelectorAll( selector ) );
    }

    // If no elements are found, display warning message in console and exit

    if ( elems.length == 0 ){
      return console.warn( selector + " inside " + viewport + " returned 0 elements." );
    }

    for ( var i = 0; i < elems.length; i++ ){

      var elem = {}
        , id   = elems[ i ].getAttribute('data-sr-id');

      if ( id ){

        // If we find an element, populate our element
        // with the object at that key in the data store

        elem = self.store.elements[ id ];
      }

      else {

        // Otherwise, create a new element.

        elem.domEl    = elems[ i ];
        elem.id       = self.serial++;
        elem.seen     = false;
        elem.revealed = false;

        elem.domEl.setAttribute( 'data-sr-id', elem.id );
      }

      // Now that we have an element, let’s update its config and styles

      elem.config = self.configFactory( config, elem.config );
      elem.styles = self.styleFactory( elem );

      elem.domEl.setAttribute( 'style',
          elem.styles.inline
        + elem.styles.transform.initial
      );

      _updateElemStore( elem );
    }

    return self;
  };



  ScrollReveal.prototype.animate = function(){

    var elem
      , key
      , visible;

    // Begin element store digest

    for ( key in self.store.elements ){
      if ( self.store.elements.hasOwnProperty( key ) ){

        elem    = self.store.elements[ key ];
        visible = self.isElemVisible( elem );

        if ( visible && !elem.revealed ){

          if ( elem.config.delay === 'always'
          || ( elem.config.delay === 'onload' && !self.initialized )
          || ( elem.config.delay === 'once'   && !elem.seen ) ){

            // Use animation with delay

            elem.domEl.setAttribute( 'style',
                elem.styles.inline
              + elem.styles.transform.target
              + elem.styles.transition.delayed
            );
          }

          else {

            // Use animation without delay

            elem.domEl.setAttribute( 'style',
                elem.styles.inline
              + elem.styles.transform.target
              + elem.styles.transition.instant
            );
          }

          elem.seen = true;
          queueCallback( 'reveal', elem );
        }

        else if ( !visible && elem.config.reset && elem.revealed ){

          elem.domEl.setAttribute( 'style',
              elem.styles.inline
            + elem.styles.transform.initial
            + elem.styles.transition.instant
          );

          queueCallback( 'reset', elem );
        }
      }
    }

    // Unblock the event handler and register the first initialization

    self.blocked = false;

    function queueCallback( type, elem ){

      var elapsed  = 0
        , duration = elem.styles.duration[ type ]
        , callback = "after" + type.charAt(0).toUpperCase() + type.slice(1);

      // Check if element already has a running timer, and capture the elapsed
      // time so we can offset the animation duration

      if ( elem.timer ){
        elapsed = Math.abs( elem.timer.started - new Date() );
        window.clearTimeout( elem.timer.clock );
      }

      elem.timer = { started: new Date() };

      elem.timer.clock = window.setTimeout(function(){

        elem.config[ callback ]( elem.domEl );
        elem.timer = null;

      }, duration - elapsed );

      return ( type == "reveal" ) ? elem.revealed = true : elem.revealed = false;
    }
  };



  ScrollReveal.prototype.configFactory = function( config, context ){

    // The default context is the instance defaults, but in cases
    // where we call sr.reveal() more than once on the same element set
    // (perhaps to re-configure or override), we pass the element's
    // existing configutation as the context

    if ( !context ){
      context = self.defaults;
    }

    if ( !config ) {
      config = context;
    }

    else if ( _isObject( config ) ){
      config = _extendClone( context, config );
    }

    // Now let’s prepare the configuration for CSS

    if ( config.easing == 'hustle' ){
      config.easing = 'cubic-bezier( 0.6, 0.2, 0.1, 1 )';
    }

    if ( config.enter === 'top' || config.enter === 'bottom' ){
      config.axis = 'Y';
    } else {
      config.axis = 'X';
    }

    // Let’s make sure our our pixel distances are negative for top and left.
    // e.g. "enter top and move 25px" starts at 'top: -25px' in CSS

    if ( config.enter === 'top' || config.enter === 'left' ){
      config.move = '-' + config.move;
    }

    return config;
  };



  ScrollReveal.prototype.styleFactory = function( elem ){

    var inline
      , config
      , duration
      , elOpacity
      , original

      , transform  = {}
      , transition = {};

    // You can customize ScrollReveal with mobile-only logic here, for example,
    // change the starting opacity, or remove animation delay

    if ( self.isMobile() && self.defaults.mobile ){
      // Stuff...
    }

    // Capture the original inline styles.

    if ( !elem.styles ){
      original = elem.domEl.getAttribute('style')
    } else {
      original = elem.styles.original;
    }

    // Since JavaScript runs after the page has begun rendering, it’s possible
    // that elements will be seen before ScrollReveal can hide them during
    // initialization

    // One technique is to apply `visibility: hidden` via CSS to your elements
    // so they load hidden, allowing ScrollReveal to overwrite visibility here

    if ( original ){
      inline = original + '; visibility: visible; ';
    } else {
      inline = 'visibility: visible; ';
    }

    // Retrieve the computed opacity

    if ( !elem.opacity ){
      elem.opacity = window.getComputedStyle( elem.domEl ).opacity
    }

    elOpacity = elem.opactiy;

    // Calculate animation duration (in milliseconds)

    config   = elem.config;
    duration = {};

    duration.reveal = ( parseFloat( config.over ) + parseFloat( config.wait ) ) * 1000
    duration.reset  =   parseFloat( config.over ) * 1000;

    // Build unprefixed and webkit transition styles

    transition.delayed = '-webkit-transition: -webkit-transform ' + config.over + ' ' + config.easing + ' ' + config.wait + ', opacity ' + config.over + ' ' + config.easing + ' ' + config.wait + '; ' +
                                 'transition: transform '         + config.over + ' ' + config.easing + ' ' + config.wait + ', opacity ' + config.over + ' ' + config.easing + ' ' + config.wait + '; ' +
                        '-webkit-perspective: 1000;' +
                '-webkit-backface-visibility: hidden;';

    transition.instant = '-webkit-transition: -webkit-transform ' + config.over + ' ' + config.easing + ' 0s, opacity ' + config.over + ' ' + config.easing + ' 0s; ' +
                                 'transition: transform '         + config.over + ' ' + config.easing + ' 0s, opacity ' + config.over + ' ' + config.easing + ' 0s; ' +
                        '-webkit-perspective: 1000; ' +
                '-webkit-backface-visibility: hidden; ';

    // Create initial and target animation styles

    transform.initial = 'transform:';
    transform.target  = 'transform:';

    generateStyles( transform );

    // Create initial and target animation styles again, for webkit browsers

    transform.initial += '-webkit-transform:';
    transform.target  += '-webkit-transform:';

    generateStyles( transform );

    return {
      inline:     inline,
      duration:   duration,
      original:   original,
      transform:  transform,
      transition: transition
    };

    function generateStyles(t){

      if ( parseInt( config.move ) !== 0 ){
        t.initial += ' translate' + config.axis + '(' + config.move + ')';
        t.target  += ' translate' + config.axis + '(0)';
      }

      if ( parseInt( config.scale.power ) !== 0 ){

        if ( config.scale.direction === 'up' ){
          config.scale.value = 1 - ( parseFloat( config.scale.power ) * 0.01 );
        }

        else if ( config.scale.direction === 'down' ){
          config.scale.value = 1 + ( parseFloat( config.scale.power ) * 0.01 );
        }

        t.initial += ' scale(' + config.scale.value + ')';
        t.target  += ' scale(1)';
      }

      if ( config.rotate.x ){
        t.initial += ' rotateX(' + config.rotate.x + ')';
        t.target  += ' rotateX(0)';
      }

      if ( config.rotate.y ){
        t.initial += ' rotateY(' + config.rotate.y + ')';
        t.target  += ' rotateY(0)';
      }

      if ( config.rotate.z ){
        t.initial += ' rotateZ(' + config.rotate.z + ')';
        t.target  += ' rotateZ(0)';
      }

      t.initial += '; opacity: ' + config.opacity + '; ';
      t.target  += '; opacity: ' + elOpacity + '; ';
    }
  };



  ScrollReveal.prototype.getViewportSize = function( viewport ){

    var clientWidth  = viewport['clientWidth']  || 0
      , clientHeight = viewport['clientHeight'] || 0;

    if ( viewport === window.document.documentElement ){

      var w = Math.max( clientWidth,  window.innerWidth  || 0 );
      var h = Math.max( clientHeight, window.innerHeight || 0 );

      return {
        width:  w,
        height: h
      };
    }

    return {
      width:  clientWidth,
      height: clientHeight
    };
  };



  ScrollReveal.prototype.getScrolled = function( viewport ){

    if ( viewport === window.document.documentElement ){
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      };
    }

    else {
      return {
        x: viewport.scrollLeft + viewport.offsetLeft,
        y: viewport.scrollTop + viewport.offsetTop
      };
    }
  };



  ScrollReveal.prototype.getOffset = function( domEl ){

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
      top:  offsetTop,
      left: offsetLeft
    };
  };



  ScrollReveal.prototype.isElemVisible = function( elem ){

    var offset   = self.getOffset( elem.domEl )
      , viewport = self.getViewportSize( elem.config.viewport )
      , scrolled = self.getScrolled( elem.config.viewport )

      , elHeight = elem.domEl.offsetHeight
      , elWidth  = elem.domEl.offsetWidth

      , elTop    = offset.top
      , elBottom = elTop + elHeight
      , elLeft   = offset.left
      , elRight  = elLeft + elWidth

      , vFactor  = elem.config.vFactor;

    return ( confirmBounds() || isPositionFixed() );

    function confirmBounds(){

      var top        = elTop + elHeight * vFactor
        , bottom     = elBottom - elHeight * vFactor
        , left       = elLeft + elWidth * vFactor
        , right      = elRight - elWidth * vFactor

        , viewTop    = scrolled.y
        , viewBottom = scrolled.y + viewport.height
        , viewLeft   = scrolled.x
        , viewRight  = scrolled.x + viewport.width;

      return ( top    < viewBottom )
          && ( bottom > viewTop    )
          && ( left   > viewLeft   )
          && ( right  < viewRight  );
    }

    function isPositionFixed(){
      return ( window.getComputedStyle( elem.domEl ).position === 'fixed' );
    }
  };



  ScrollReveal.prototype.isMobile = function(){

    var agent = navigator.userAgent || navigator.vendor || window.opera;

    return (/(ipad|playbook|silk|android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test( agent )||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( agent.substr( 0, 4 ))) ? true : false;
  };



  ScrollReveal.prototype.isSupported = function(){

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



  ScrollReveal.prototype.cleanDOM = function(){
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

        if ( _isObject( src[ prop ] ) ){
          if ( !target[ prop ] || !_isObject( target[ prop ] ) ){
            target[ prop ] = {};
          }
          _extend( target[ prop ], src[ prop ] );
        }

        else {
          target[ prop ] = src[ prop ];
        }
      }
    }

    return target;
  };

  _extendClone = function( target, src ){
    var clone = {};
    return _extend( _extend( clone, target ), src );
  };

  _isNode = function( obj ){
    return (
      typeof HTMLElement === "object" ? obj instanceof HTMLElement : // DOM2
      obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName==="string"
    );
  };

  _isObject = function( obj ){
    return ( typeof obj === 'object' && obj.constructor == Object );
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

  return ScrollReveal;

})( window );
