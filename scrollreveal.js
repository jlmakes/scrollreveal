/*
            _____                 ________                       __
           / ___/______________  / / / __ \___ _   _____  ____ _/ /
           \__ \/ ___/ ___/ __ \/ / / /_/ / _ \ | / / _ \/ __ `/ /
          ___/ / /__/ /  / /_/ / / / _, _/  __/ |/ /  __/ /_/ / /
         /____/\___/_/   \____/_/_/_/ |_|\___/|___/\___/\__,_/_/    v3.0.9

‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
   Copyright 2014–2016 Julian Lloyd (@jlmakes) Open source under MIT license
————————————————————————————————————————————————————————————————————————————————
    https://scrollrevealjs.org — https://github.com/jlmakes/scrollreveal.js
______________________________________________________________________________*/

(function(){
  var Tools, sr, _requestAnimationFrame;
  this.ScrollReveal = (function(){

    ScrollReveal.prototype.defaults = {

      // Configuration
      // -------------
      // This object signature can be passed directly to the ScrollReveal
      // constructor, or as the second argument of the reveal() method.

      //            'bottom', 'left', 'top', 'right'
      origin      : 'bottom',

      //            Can be any valid CSS distance, e.g.
      //            '5rem', '10%', '20vw', etc.
      distance    : '20px',

      //            Time in milliseconds.
      duration    : 500,
      delay       : 0,

      //            Starting angles in degrees, will transition from these
      //            values to 0 in all axes.
      rotate      : { x : 0, y : 0, z : 0 },

      //            Starting opacity value, will transition from this value to
      //            the elements computed opacity.
      opacity     : 0,

      //            Starting scale value, will transition from this value to 1
      scale       : 0.9,

      //            Accepts any valid CSS easing, e.g.
      //            'ease', 'ease-in-out', 'linear', etc.
      easing      : 'cubic-bezier( 0.6, 0.2, 0.1, 1 )',

      //            When null, `<html>` is assumed to be the reveal container.
      //            You can pass a DOM node as a custom container, e.g.
      //            document.querySelector('.fooContainer');
      container   : null,

      //            true/false to control reveal animations on mobile.
      mobile      : true,

      //            true:  reveals occur every time elements become visible
      //            false: reveals occur once as elements become visible
      reset       : false,

      //            'always' — delay for all reveal animations
      //            'once'   — delay only the first time reveals occur
      //            'onload' - delay only for animations triggered by first load
      useDelay    : 'always',

      //            Change when an element is considered in the viewport.
      //            The default value of 0.20 means 20% of an element must be
      //            visible for its reveal to occur.
      viewFactor  : 0.2,

      //            Pixel values that alter the container boundaries. e.g.
      //            Set `{ top: 48 }`, if you have a 48px tall fixed toolbar.
      //            --
      //            Visual Aid: https://scrollrevealjs.org/assets/viewoffset.png
      viewOffset  : { top : 0, right : 0, bottom : 0, left : 0 },

      //            Callbacks that fire for each completed element reveal, and
      //            if `config.reset = true`, for each completed element reset.
      //            When creating your callbacks, remember they are passed the
      //            element’s DOM node that triggered it as the first argument.
      afterReveal : function( domEl ){},
      afterReset  : function( domEl ){}
    };

////////////////////////////////////////////////////////////////////////////////

    function ScrollReveal( config ){
      if ( window == this ){
        return new ScrollReveal( config );
      }
      sr = this;
      sr.tools = new Tools();
      sr.tools.extend( sr.defaults, config || {} );
      _confirmContainer( sr.defaults );

      if ( !sr.supported() ){
        console.log('ScrollReveal is not supported in this browser.');
      }

      sr.store = {
        elements   : {},
        containers : []
      };
      sr.history     = [];
      sr.counter     = 0;
      sr.initialized = false;
      return sr;
    }

////////////////////////////////////////////////////////////////////////////////

    ScrollReveal.prototype.supported = function(){
      var style = document.documentElement.style;
      return (
        'WebkitTransition' in style && 'WebkitTransform' in style ||
        'transition' in style && 'transform' in style ) ? true : false;
    };

////////////////////////////////////////////////////////////////////////////////

    ScrollReveal.prototype.reveal = function( selector, config, sync ){
      var elements, container, elem, elemId;

      // Deduce the correct container.
      if ( config && config.container ){
        _confirmContainer( config );
        container = config.container;
      } else if ( sr.defaults.container ){
        container = sr.defaults.container;
      } else {
        container = window.document.documentElement;
      }

      // Let’s check to see if a DOM node was passed in as the first argument,
      // otherwise query the container for all elements matching the selector.
      if ( sr.tools.isNode( selector )){
        elements = [ selector ];
      } else {
        elements = Array.prototype.slice.call( container.querySelectorAll( selector ) );
      }

      // Confirm we found some elements.
      if ( !elements.length ){
        console.log('reveal(\'' + selector + '\') failed: no elements found.');
        return sr;
      }

      // Begin main loop to configure ScrollReveal elements.
      for ( var i = 0; i < elements.length; i++ ){
        // Check if the element has already been configured.
        elemId = elements[ i ].getAttribute('data-sr-id');
        // If so, grab it from the store.
        if ( elemId ){
          elem = sr.store.elements[ elemId ];
        }
        // Otherwise, let’s do some basic setup.
        else {
          elem = {
            id       : ++sr.counter,
            domEl    : elements[ i ],
            seen     : false,
            revealed : false
          };
          elem.domEl.setAttribute( 'data-sr-id', elem.id );
        }

        // New or existing element, it’s time to update its configuration,
        // styles, and send the updates to our store.
        _configure( elem, config || {} );
        _style( elem );
        _updateStore( elem );

        // We need to make sure elements are set to visibility: visibile,
        // even when on mobile and `config.mobile == false`, or if unsupported.
        if ( sr.tools.isMobile() && !elem.config.mobile || !sr.supported() ){
          elem.domEl.setAttribute( 'style', elem.styles.inline );
          elem.disabled = true;
        }
        // Otherwise, proceed normally.
        else if ( !elem.revealed ){
          elem.domEl.setAttribute( 'style',
              elem.styles.inline
            + elem.styles.transform.initial
          );
        }
      }

      // Each `reveal()` is recorded so that when calling `sync()` while working
      // with asynchronously loaded content, it can re-trace your steps but with
      // all your new elements now in the DOM.

      // Since `reveal()` is called internally by `sync()`, we don’t want to
      // record or intiialize each reveal during syncing.
      if ( !sync && sr.supported() ){
        _record( selector, config );
        // We push initialization to the event queue using setTimeout, so that
        // we can give ScrollReveal room to process all reveal calls before
        // putting things into motion.
        // --
        // Recommended: Philip Roberts - What the heck is the event loop anyway?
        // @ JSConf EU 2014: https://www.youtube.com/watch?v=8aGhZQkoFbQ
        if ( sr.initTimeout ){
          window.clearTimeout( sr.initTimeout );
        }
        sr.initTimeout = window.setTimeout( _init, 0 );
      }
      return sr;
    };

////////////////////////////////////////////////////////////////////////////////

    ScrollReveal.prototype.sync = function(){
      if ( sr.history.length && sr.supported() ){
        // Loop through all stored recorded `reveal()` calls, and run them
        // again to make sure all elements in the DOM are properly recognized
        // by ScrollReveal.
        for ( var i = 0; i < sr.history.length; i++ ){
          var record = sr.history[ i ];
          sr.reveal( record.selector, record.config, true );
        };
        // Now that we’re done, initialize the updates.
        _init();
      } else {
        console.log('sync() failed: no reveals found.');
      }
      return sr;
    };

////////////////////////////////////////////////////////////////////////////////

    // Private Methods
    // ---------------
    // Ah, the beauty of closures. These methods remain accessible ONLY to the
    // ScrollReveal instance, even though they technically only 'lived' during
    // it’s instantiation outside of the constructors scope.

    function _confirmContainer( config ){
      // Let’s check if our container is a selector.
      var container = config.container;
      if ( container && typeof container == 'string' ){
        config.container = window.document.querySelector( config.container );
      }
      // Otherwise, let’s make sure it’s a node or use null and error silently.
      else if ( !sr.tools.isNode( container ) ){
        config.container = null;
        console.log('ScrollReveal: Invalid container provided.');
      }
    }

////////////////////////////////////////////////////////////////////////////////

    function _configure( elem, config ){
      // If the element hasn’t already been configured, let’s use a clone of the
      // defaults extended by the configuration passed as the second argument.
      if ( !elem.config ){
        elem.config = sr.tools.extendClone( sr.defaults, config );
      }
      // Otherwise, let’s use a clone of the existing element configuration
      // extended by the configuration passed as the second argument.
      else {
        elem.config = sr.tools.extendClone( elem.config, config );
      }
      // Infer CSS Transform axis from origin string.
      if ( elem.config.origin === 'top' || elem.config.origin === 'bottom' ){
        elem.config.axis = 'Y';
      } else {
        elem.config.axis = 'X';
      }
      // Let’s make sure our our pixel distances are negative for top and left.
      // e.g. config.origin = 'top' and config.distance = '25px' actually starts
      // at `top: -25px` in CSS.
      if ( elem.config.origin === 'top' || elem.config.origin === 'left' ){
        elem.config.distance = '-' + elem.config.distance;
      }
    }

////////////////////////////////////////////////////////////////////////////////

    function _style( elem ){
      var computed = window.getComputedStyle( elem.domEl );

      if ( !elem.styles ){
        elem.styles = {
          transition : {},
          transform  : {},
          computed   : {}
        };
        // Capture any existing inline styles, and add our visibility override.
        // --
        // See section 4.2. in the Documentation:
        // https://github.com/jlmakes/scrollreveal.js#42-improve-user-experience
        elem.styles.inline  = elem.domEl.getAttribute('style') || '';
        elem.styles.inline += '; visibility: visible; ';

        // grab the elements existing opacity.
        elem.styles.computed.opacity = computed.opacity;
        // grab the elements existing transitions.
        if ( !computed.transition || computed.transition == 'all 0s ease 0s' ){
          elem.styles.computed.transition = '';
        } else {
          elem.styles.computed.transition = computed.transition + ', ';
        }
      }

      // Create transition styles
      elem.styles.transition.instant = _generateTransition( elem, 0 );
      elem.styles.transition.delayed = _generateTransition( elem, elem.config.delay );

      // Generate transform styles, first with the webkit prefix.
      elem.styles.transform.initial = ' -webkit-transform:';
      elem.styles.transform.target  = ' -webkit-transform:';
      _generateTransform( elem );

      // And again without any prefix.
      elem.styles.transform.initial += 'transform:';
      elem.styles.transform.target  += 'transform:';
      _generateTransform( elem );

    }

////////////////////////////////////////////////////////////////////////////////

    function _generateTransition( elem, delay ){
      var config = elem.config;
      return '-webkit-transition: ' + elem.styles.computed.transition + '-webkit-transform ' + config.duration / 1000 + 's ' + config.easing + ' ' + delay / 1000 + 's, opacity ' + config.duration / 1000 + 's ' + config.easing + ' ' + delay / 1000 + 's; ' +
                     'transition: ' + elem.styles.computed.transition + 'transform ' + config.duration / 1000 + 's ' + config.easing + ' ' + delay / 1000 + 's, opacity ' + config.duration / 1000 + 's ' + config.easing + ' ' + delay / 1000 + 's; ';
    }

////////////////////////////////////////////////////////////////////////////////

    function _generateTransform( elem ){
      var config    = elem.config;
      var transform = elem.styles.transform;

      if ( parseInt( config.distance ) ){
        transform.initial += ' translate' + config.axis + '(' + config.distance + ')';
        transform.target  += ' translate' + config.axis + '(0)';
      }
      if ( config.scale ){
        transform.initial += ' scale(' + config.scale + ')';
        transform.target  += ' scale(1)';
      }
      if ( config.rotate.x ){
        transform.initial += ' rotateX(' + config.rotate.x + 'deg)';
        transform.target  += ' rotateX(0)';
      }
      if ( config.rotate.y ){
        transform.initial += ' rotateY(' + config.rotate.y + 'deg)';
        transform.target  += ' rotateY(0)';
      }
      if ( config.rotate.z ){
        transform.initial += ' rotateZ(' + config.rotate.z + 'deg)';
        transform.target  += ' rotateZ(0)';
      }
      transform.initial += '; opacity: ' + config.opacity + ';';
      transform.target  += '; opacity: ' + elem.styles.computed.opacity + ';';
    }

////////////////////////////////////////////////////////////////////////////////

    function _updateStore( elem ){
      var container = elem.config.container;
      // If this element’s container isn’t already in the store, let’s add it.
      if ( container && sr.store.containers.indexOf( container ) == -1 ){
        sr.store.containers.push( elem.config.container );
      }
      // Update the element stored with our new element.
      sr.store.elements[ elem.id ] = elem;
    };

////////////////////////////////////////////////////////////////////////////////

    function _record( selector, config ){
      // Save the `reveal()` arguments that triggered this `_record()` call,
      // so we can re-trace our steps when calling the `sync()` method.
      var record = {
        selector : selector,
        config   : config
      };
      sr.history.push( record );
    }

////////////////////////////////////////////////////////////////////////////////

    function _init(){
      if ( sr.supported() ){
        // Initial animate call triggers valid reveal animations on first load.
        // Subsequent animate calls are made inside the event handler.
        _animate();
        // Then we loop through all container nodes in the store and bind event
        // listeners to each.
        for ( var i = 0; i < sr.store.containers.length; i++ ){
          sr.store.containers[ i ].addEventListener( 'scroll', _handler );
          sr.store.containers[ i ].addEventListener( 'resize', _handler );
        }
        // Let’s also do a one-time binding of window event listeners.
        if ( !sr.initialized ){
          window.addEventListener( 'scroll', _handler );
          window.addEventListener( 'resize', _handler );
          sr.initialized = true;
        }
      }
      return sr;
    }

////////////////////////////////////////////////////////////////////////////////

    function _handler(){
      _requestAnimationFrame( _animate );
    }

////////////////////////////////////////////////////////////////////////////////

    function _animate(){
      var elem;
      // Loop through all elements in the store
      sr.tools.forOwn( sr.store.elements, function( elemId ){
        elem = sr.store.elements[ elemId ];
        // Let’s see if we should reveal, and if so, whether to use delay.
        if ( _shouldReveal( elem ) ){
          if ( _shouldUseDelay( elem ) ){
            elem.domEl.setAttribute( 'style',
                elem.styles.inline
              + elem.styles.transform.target
              + elem.styles.transition.delayed
            );
          } else {
            elem.domEl.setAttribute( 'style',
                elem.styles.inline
              + elem.styles.transform.target
              + elem.styles.transition.instant
            );
          }
          // The element revealed, so let’s queue the `afterReveal` callback,
          // and mark it as `seen` for future reference.
          _queueCallback( 'reveal', elem );
          return elem.seen = true;
        }
        // If we got this far our element shouldn’t reveal, but should it reset?
        if ( _shouldReset( elem ) ){
          elem.domEl.setAttribute( 'style',
              elem.styles.inline
            + elem.styles.transform.initial
            + elem.styles.transition.instant
          );
          _queueCallback( 'reset', elem );
        }
      });
    }

////////////////////////////////////////////////////////////////////////////////

    function _queueCallback( type, elem ){
      var elapsed  = 0;
      var duration = 0;
      var callback = 'after';
      // deduce the correct callback.
      switch ( type ){
        case 'reveal':
          duration = elem.config.duration + elem.config.delay;
          callback += 'Reveal';
          break;
        case 'reset':
          duration = elem.config.duration;
          callback += 'Reset';
          break;
      }
      // If a countdown timer is already running, let’s capture the elapsed
      // time and clear the clock. (i.e. animation was canceled.)
      if ( elem.timer ){
        elapsed = Math.abs( elem.timer.started - new Date() );
        window.clearTimeout( elem.timer.clock );
      }
      // Start a new timer...
      elem.timer = { started : new Date() };
      elem.timer.clock = window.setTimeout(function(){
        // The timer completed, so let’s fire the callback and kill the timer.
        elem.config[ callback ]( elem.domEl );
        elem.timer = null;
      }, duration - elapsed );
      // Update element status for future animate loops.
      return type === 'reveal' ? elem.revealed = true : elem.revealed = false;
    }

////////////////////////////////////////////////////////////////////////////////

    function _shouldReveal( elem ){
      var visible = _isElemVisible( elem );
      return ( visible && !elem.revealed && !elem.disabled ) ? true : false;
    }

////////////////////////////////////////////////////////////////////////////////

    function _shouldUseDelay( elem ){
      var delayType = elem.config.useDelay;
      return ( delayType === 'always'
          || ( delayType === 'onload' && !sr.initialized )
          || ( delayType === 'once'   && !elem.seen ) ) ? true : false;
    }

////////////////////////////////////////////////////////////////////////////////

    function _shouldReset( elem ){
      var visible = _isElemVisible( elem );
      return ( !visible && elem.config.reset
          && elem.revealed && !elem.disabled ) ? true : false;
    }

////////////////////////////////////////////////////////////////////////////////

    function _getContainer( container ){
      if ( !container ){
        container = window.document.documentElement;
      }
      var w = container.clientWidth;
      var h = container.clientHeight;
      return {
        width  : w,
        height : h
      };
    }

////////////////////////////////////////////////////////////////////////////////

    function _getScrolled( container ){
      // Return the container scroll values, plus the offset values of its
      // position (since element offset is relevant to the document origin.)
      if ( container ){
        var offset = _getOffset( container );
        return {
          x : container.scrollLeft + offset.left,
          y : container.scrollTop  + offset.top
        };
      }
      // Otherwise, default to the window object’s scroll values.
      else {
        return {
          x : window.pageXOffset,
          y : window.pageYOffset
        };
      }
    }

////////////////////////////////////////////////////////////////////////////////

    function _getOffset( domEl ){
      var offsetTop    = 0;
      var offsetLeft   = 0;
      // Grab the element’s dimensions.
      var offsetHeight = domEl.offsetHeight;
      var offsetWidth  = domEl.offsetWidth;
      // Now calculate the distance between the element and its parent, then
      // again for the parent to its parent, and again etc... until we have the
      // total distance of the element to the document’s top and left origin.
      do {
        if ( !isNaN( domEl.offsetTop ) ){
          offsetTop += domEl.offsetTop;
        }
        if ( !isNaN( domEl.offsetLeft ) ){
          offsetLeft += domEl.offsetLeft;
        }
      } while ( domEl = domEl.offsetParent );

      return {
        top    : offsetTop,
        left   : offsetLeft,
        height : offsetHeight,
        width  : offsetWidth
      };
    }

////////////////////////////////////////////////////////////////////////////////

    function _isElemVisible( elem ){
      var offset     = _getOffset( elem.domEl );
      var container  = _getContainer( elem.config.container );
      var scrolled   = _getScrolled( elem.config.container );
      var vF         = elem.config.viewFactor;
      // Define the element geometry.
      var elemHeight = offset.height;
      var elemWidth  = offset.width;
      var elemTop    = offset.top;
      var elemLeft   = offset.left;
      var elemBottom = elemTop  + elemHeight;
      var elemRight  = elemLeft + elemWidth;

      return ( confirmBounds() || isPositionFixed() );

      function confirmBounds(){
        // Define the element functional boundaries, including the viewFactor.
        var top        = elemTop    + elemHeight * vF;
        var left       = elemLeft   + elemWidth  * vF;
        var bottom     = elemBottom - elemHeight * vF;
        var right      = elemRight  - elemWidth  * vF;
        // Define the container boundaries.
        var viewTop    = scrolled.y + elem.config.viewOffset.top;
        var viewLeft   = scrolled.x + elem.config.viewOffset.left;
        var viewBottom = scrolled.y - elem.config.viewOffset.bottom + container.height;
        var viewRight  = scrolled.x - elem.config.viewOffset.right  + container.width;
        // Check if our element is within bounds.
        return ( top    < viewBottom )
            && ( bottom > viewTop    )
            && ( left   > viewLeft   )
            && ( right  < viewRight  );
      }

      function isPositionFixed(){
        return ( window.getComputedStyle( elem.domEl ).position === 'fixed' );
      }
    }

    return ScrollReveal;

  })();

  // helper.tools.js
  // ---------------
  // Simple deep object extend, and a few other agnostic helper methods.
  // gist: https://gist.github.com/jlmakes/9f104e3f1b4d86334987

  var Tools = (function(){

    Tools.prototype.isObject = function( object ){
      return object !== null && typeof object === 'object' && object.constructor == Object;
    };

    Tools.prototype.isNode = function( object ) {
      return (
        typeof Node === 'object'
        ? object instanceof Node
        : object && typeof object === 'object'
                 && typeof object.nodeType === 'number'
                 && typeof object.nodeName === 'string'
      );
    };

    Tools.prototype.forOwn = function( object, callback ){
      if ( !this.isObject( object ) ){
        throw new TypeError('Expected \'object\', but received \'' + typeof object + '\'.');
      } else {
        for ( var property in object ){
          if ( object.hasOwnProperty( property ) ){
            callback( property );
          }
        }
      }
    };

    Tools.prototype.extend = function( target, source ){
      this.forOwn( source, function( property ){
        if ( this.isObject( source[ property ] ) ){
          if ( !target[ property ] || !this.isObject( target[ property ] ) ){
            target[ property ] = {};
          }
          this.extend( target[ property ], source[ property ] );
        } else {
          target[ property ] = source[ property ];
        }
      }.bind( this ));
      return target;
    };

    Tools.prototype.extendClone = function( target, source ){
      return this.extend( this.extend( {}, target ), source );
    };

    Tools.prototype.isMobile = function(){
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent );
    };

    function Tools(){};
    return Tools;

  })();

  var _requestAnimationFrame = window.requestAnimationFrame       ||
                               window.webkitRequestAnimationFrame ||
                               window.mozRequestAnimationFrame;

}).call( this );
