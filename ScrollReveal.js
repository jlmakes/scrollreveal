/*
           _____                 ________                       __
          / ___/______________  / / / __ \___ _   _____  ____ _/ /
          \__ \/ ___/ ___/ __ \/ / / /_/ / _ \ | / / _ \/ __ `/ /
         ___/ / /__/ /  / /_/ / / / _, _/  __/ |/ /  __/ /_/ / /
        /____/\___/_/   \____/_/_/_/ |_|\___/|___/\___/\__,_/_/   v3.0.0

////////////////////////////////////////////////////////////////////////////////

      Copyright 2016 Julian Lloyd (@jlmakes) Open source under MIT license

//////////////////////////////////////////////////////////////////////////////*/

window.ScrollReveal = (function( window ){

  'use strict';

  var self

    // private methods
    , _animate
    , _cleanDOM
    , _configFactory
    , _handler
    , _styleFactory
    , _updateElemStore

    // local utils
    , _getViewportScrolled
    , _getViewportSize
    , _isElemVisible
    , _isSupported

    // generic utils
    , _extend
    , _extendClone
    , _getElOffset
    , _isMobile
    , _isNode
    , _isObject

    // polyfill
    , _requestAnimFrame;

  function ScrollReveal( config ){

    self = this;

    _extend( self.defaults, config );

    if ( _isMobile( navigator.userAgent ) && !self.defaults.mobile || !_isSupported() ){

      _cleanDOM();
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

  //////////////////////////////////////////////////////////////////////////////

  ScrollReveal.prototype.defaults = {

    enter:       'bottom', // top, right, bottom, left
    move:        '0px',
    over:        '0.6s',
    wait:        '0s',
    easing:      'cubic-bezier( 0.6, 0.2, 0.1, 1 )', // any valid CSS easing

    scale:       { direction: 'up', power: '10%' }, // up, down
    rotate:      { x: '0deg', y: '0deg', z: '0deg' },

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

  //////////////////////////////////////////////////////////////////////////////

  ScrollReveal.prototype.init = function(){

    var viewport;

    _animate();

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

  //////////////////////////////////////////////////////////////////////////////

  ScrollReveal.prototype.reveal = function( selector, config ){

    var elems, viewport;

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

      elem.config = _configFactory( config, elem.config );
      elem.styles = _styleFactory( elem );

      elem.domEl.setAttribute( 'style',
          elem.styles.inline
        + elem.styles.transform.initial
      );

      _updateElemStore( elem );
    }

    return self;
  };

  // Private Methods ///////////////////////////////////////////////////////////

  _animate = function(){

    var elem
      , key
      , visible;

    // Begin element store digest

    for ( key in self.store.elements ){
      if ( self.store.elements.hasOwnProperty( key ) ){

        elem    = self.store.elements[ key ];
        visible = _isElemVisible( elem );

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

  //////////////////////////////////////////////////////////////////////////////

  _cleanDOM = function(){
    for ( var key in self.store.elements ){
      if ( self.store.elements.hasOwnProperty( key ) ){
        self.store.elements[ key ].domEl.removeAttribute('data-sr-id');
      }
    }
  };

  //////////////////////////////////////////////////////////////////////////////

  _configFactory = function( config, context ){

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

    if ( config.enter === 'top' || config.enter === 'bottom' ){
      config.axis = 'Y';
    } else {
      config.axis = 'X';
    }

    // Let’s make sure our our pixel distances are negative for top and left
    // e.g. { enter: 'top', move: '25px' } starts at 'top: -25px' in CSS

    if ( config.enter === 'top' || config.enter === 'left' ){
      config.move = '-' + config.move;
    }

    return config;
  };

  //////////////////////////////////////////////////////////////////////////////

  _handler = function(){
    if ( !self.blocked ){
      self.blocked = true;
      _requestAnimFrame( _animate );
    }
  };

  //////////////////////////////////////////////////////////////////////////////

  _styleFactory = function( elem ){

    var inline
      , config
      , duration
      , elOpacity
      , original

      , transform  = {}
      , transition = {};

    // You can customize ScrollReveal with mobile-only logic here, for example,
    // change the starting opacity, or remove animation delay

    if ( _isMobile() && self.defaults.mobile ){
      // Stuff...
    }

    // Capture the original inline styles

    if ( !elem.styles ){
      original = elem.domEl.getAttribute('style')
    } else {
      original = elem.styles.original;
    }

    // Since JavaScript runs after the page has begun rendering, it’s possible
    // that elements will be seen before ScrollReveal can hide them during
    // initialization...
    //
    // The solution is using `visibility: hidden` (CSS) on your elements to
    // ensure they load hidden, and here is where we handle that expectation

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

    // _styleFactory Methods -------------------------------------------------//

    function generateStyles( t ){

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

  //////////////////////////////////////////////////////////////////////////////

  _updateElemStore = function( elem ){

    self.store.elements[ elem.id ] = elem;

    if ( self.store.viewports.indexOf( elem.config.viewport ) == -1 ){
      self.store.viewports.push( elem.config.viewport );
    }
  };

  // Local Utils ///////////////////////////////////////////////////////////////

  _getViewportScrolled = function( viewport ){

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

  //////////////////////////////////////////////////////////////////////////////

  _getViewportSize = function( viewport ){

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

  //////////////////////////////////////////////////////////////////////////////

  _isElemVisible = function( elem ){

    var offset   = _getElOffset( elem.domEl )
      , viewport = _getViewportSize( elem.config.viewport )
      , scrolled = _getViewportScrolled( elem.config.viewport )

      , elHeight = elem.domEl.offsetHeight
      , elWidth  = elem.domEl.offsetWidth

      , elTop    = offset.top
      , elBottom = elTop + elHeight
      , elLeft   = offset.left
      , elRight  = elLeft + elWidth

      , vFactor  = elem.config.vFactor;

    return ( confirmBounds() || isPositionFixed() );

    // _isElemVisible Methods ------------------------------------------------//

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

  //////////////////////////////////////////////////////////////////////////////

  _isSupported = function(){

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

  // Generic Utils /////////////////////////////////////////////////////////////

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

  //////////////////////////////////////////////////////////////////////////////

  _extendClone = function( target, src ){
    var clone = {};
    return _extend( _extend( clone, target ), src );
  };

  //////////////////////////////////////////////////////////////////////////////

  _getElOffset = function( domEl ){

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

  //////////////////////////////////////////////////////////////////////////////

  _isMobile = function( agent ){
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( agent );
  };

  //////////////////////////////////////////////////////////////////////////////

  _isNode = function( obj ){
    return (
      typeof HTMLElement === "object" ? obj instanceof HTMLElement : // DOM2
      obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName==="string"
    );
  };

  //////////////////////////////////////////////////////////////////////////////

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
