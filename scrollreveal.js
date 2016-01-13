/*
            _____                 ________                       __
           / ___/______________  / / / __ \___ _   _____  ____ _/ /
           \__ \/ ___/ ___/ __ \/ / / /_/ / _ \ | / / _ \/ __ `/ /
          ___/ / /__/ /  / /_/ / / / _, _/  __/ |/ /  __/ /_/ / /
         /____/\___/_/   \____/_/_/_/ |_|\___/|___/\___/\__,_/_/    v3.0.6

‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
   Copyright 2014–2016 Julian Lloyd (@jlmakes) Open source under MIT license
————————————————————————————————————————————————————————————————————————————————
    https://scrollrevealjs.org — https://github.com/jlmakes/scrollreveal.js
______________________________________________________________________________*/

(function(){
  var Tools, sr, _requestAnimationFrame;

  this.ScrollReveal = (function(){
    ScrollReveal.prototype.defaults = {
      // Animation
      origin      : 'bottom',
      distance    : '20px',
      duration    : 500,
      delay       : 0,
      rotate      : { x : 0, y : 0, z : 0 },
      opacity     : 0,
      scale       : 0.9,
      easing      : 'cubic-bezier( 0.6, 0.2, 0.1, 1 )',
      // Options
      container   : null,
      mobile      : true,
      reset       : false,
      useDelay    : 'always',
      viewFactor  : 0.2,
      viewOffset  : { top : 0, right : 0, bottom : 0, left : 0 },
      afterReveal : function( domEl ){},
      afterReset  : function( domEl ){}
    };

    function ScrollReveal( config ){
      if ( window == this ){
        return new ScrollReveal( config );
      }
      sr = this;
      sr.tools = new Tools();
      sr.tools.extend( sr.defaults, config || {} );

      if ( !sr.supported() ){
        console.log('ScrollReveal is not supported in this browser.');
      }

      sr.store = {
        elements   : {},
        containers : []
      };
      sr.history     = [];
      sr.counter     = 0;
      sr.running     = false;
      sr.initialized = false;
      return sr;
    }

    ScrollReveal.prototype.supported = function(){
      var style = document.documentElement.style;
      return (
        'transform'  in style && 'WebkitTransform'  in style &&
        'transition' in style && 'WebkitTransition' in style ) ? true : false;
    };

    ScrollReveal.prototype.reveal = function( selector, config, sync ){
      var elements, container, elem, elemId;

      if ( config && config.container ){
        container = config.container;
      } else if ( sr.defaults.container ){
        container = sr.defaults.container;
      } else {
        container = window.document.documentElement;
      }

      elements = Array.prototype.slice.call( container.querySelectorAll( selector ) );
      if ( !elements.length ){
        console.log('reveal(\'' + selector + '\') failed: no elements found.');
        return sr;
      }
      for ( var i = 0; i < elements.length; i++ ){
        elem   = {}
        elemId = elements[ i ].getAttribute('data-sr-id');

        if ( elemId ){
          elem = sr.store.elements[ elemId ];
        } else {
          elem = {
            id       : ++sr.counter,
            domEl    : elements[ i ],
            seen     : false,
            revealed : false
          };
          elem.domEl.setAttribute( 'data-sr-id', elem.id );
        }

        sr.configure( elem, config || {} );
        sr.style( elem );
        sr.updateStore( elem );

        if ( sr.tools.isMobile() && !elem.config.mobile || !sr.supported() ){
          elem.domEl.setAttribute( 'style', elem.styles.inline );
          elem.disabled = true;
        } else if ( !elem.revealed ){
          elem.domEl.setAttribute( 'style',
              elem.styles.inline
            + elem.styles.transform.initial
          );
        }
      }
      if ( !sync ){
        sr.record( selector, config );
        if ( sr.initTimeout ){
          window.clearTimeout( sr.initTimeout );
        }
        sr.initTimeout = window.setTimeout( sr.init, 0 );
      }
      return sr;
    };

    ScrollReveal.prototype.configure = function( elem, config ){
      if ( !elem.config ){
        elem.config = sr.tools.extendClone( sr.defaults, config );
      } else {
        elem.config = sr.tools.extendClone( elem.config, config );
      }

      if ( elem.config.origin === 'top' || elem.config.origin === 'bottom' ){
        elem.config.axis = 'Y';
      } else {
        elem.config.axis = 'X';
      }

      if ( elem.config.origin === 'top' || elem.config.origin === 'left' ){
        elem.config.distance = '-' + elem.config.distance;
      }
    };

    ScrollReveal.prototype.style = function( elem ){
      var config   = elem.config;
      var computed = window.getComputedStyle( elem.domEl );

      if ( !elem.styles ){
        elem.styles = {
          transition : {},
          transform  : {},
          computed   : {}
        };
        elem.styles.inline           = elem.domEl.getAttribute('style') || '';
        elem.styles.inline          += '; visibility: visible; ';
        elem.styles.computed.opacity = computed.opacity;

        if ( !computed.transition || computed.transition == 'all 0s ease 0s' ){
          elem.styles.computed.transition = '';
        } else {
          elem.styles.computed.transition = computed.transition + ', ';
        }
      }

      elem.styles.transition.instant = '-webkit-transition: ' + elem.styles.computed.transition + '-webkit-transform ' + config.duration / 1000 + 's ' + config.easing + ' 0s, opacity ' + config.duration / 1000 + 's ' + config.easing + ' 0s; ' +
                                               'transition: ' + elem.styles.computed.transition + 'transform ' + config.duration / 1000 + 's ' + config.easing + ' 0s, opacity ' + config.duration / 1000 + 's ' + config.easing + ' 0s; ';

      elem.styles.transition.delayed = '-webkit-transition: ' + elem.styles.computed.transition + '-webkit-transform ' + config.duration / 1000 + 's ' + config.easing + ' ' + config.delay / 1000 + 's, opacity ' + config.duration / 1000 + 's ' + config.easing + ' ' + config.delay / 1000 + 's; ' +
                                               'transition: ' + elem.styles.computed.transition + 'transform ' + config.duration / 1000 + 's ' + config.easing + ' ' + config.delay / 1000 + 's, opacity ' + config.duration / 1000 + 's ' + config.easing + ' ' + config.delay / 1000 + 's; ';

      elem.styles.transform.initial = ' -webkit-transform:';
      elem.styles.transform.target  = ' -webkit-transform:';
      generateTransform( elem.styles.transform );

      elem.styles.transform.initial += 'transform:';
      elem.styles.transform.target  += 'transform:';
      generateTransform( elem.styles.transform );

      function generateTransform( transform ){
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
    };

    ScrollReveal.prototype.updateStore = function( elem ){
      var container = elem.config.container;
      if ( container && sr.store.containers.indexOf( container ) == -1 ){
        sr.store.containers.push( elem.config.container );
      }
      sr.store.elements[ elem.id ] = elem;
    };

    ScrollReveal.prototype.record = function( selector, config ){
      var record = {
        selector : selector,
        config   : config
      };
      sr.history.push( record );
    };

    ScrollReveal.prototype.init = function(){
      if ( sr.supported() ){
        sr.animate();
        for ( var i = 0; i < sr.store.containers.length; i++ ){
          sr.store.containers[ i ].addEventListener( 'scroll', sr.handler );
          sr.store.containers[ i ].addEventListener( 'resize', sr.handler );
        }
        if ( !sr.initialized ){
          window.addEventListener( 'scroll', sr.handler );
          window.addEventListener( 'resize', sr.handler );
          sr.initialized = true;
        }
      }
      return sr;
    };

    ScrollReveal.prototype.handler = function(){
      if ( !sr.running ){
        _requestAnimationFrame(function(){
          sr.running = true;
          sr.animate();
        });
      }
    };

    ScrollReveal.prototype.animate = function(){
      var elem, visible;

      sr.tools.forOwn( sr.store.elements, function( elemId ){
        elem    = sr.store.elements[ elemId ];
        visible = sr.isElemVisible( elem );
        if ( visible && !elem.revealed && !elem.disabled ){

          if ( elem.config.useDelay === 'always'
          || ( elem.config.useDelay === 'onload' && !sr.initialized )
          || ( elem.config.useDelay === 'once'   && !elem.seen ) ){
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
          elem.seen = true;
          queueCallback( 'reveal', elem );

        } else if ( !visible && elem.config.reset && elem.revealed && !elem.disabled ){
          elem.domEl.setAttribute( 'style',
              elem.styles.inline
            + elem.styles.transform.initial
            + elem.styles.transition.instant
          );
          queueCallback( 'reset', elem );
        }
      });

      sr.running = false;

      function queueCallback( type, elem ){
        var elapsed  = 0;
        var duration = 0;
        var callback = 'after';

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

        if ( elem.timer ){
          elapsed = Math.abs( elem.timer.started - new Date() );
          window.clearTimeout( elem.timer.clock );
        }

        elem.timer = { started: new Date() };

        elem.timer.clock = window.setTimeout(function(){
          elem.config[ callback ]( elem.domEl );
          elem.timer = null;
        }, duration - elapsed );
        return type === 'reveal' ? elem.revealed = true : elem.revealed = false;
      }
    };

    ScrollReveal.prototype.getContainer = function( container ){
      if ( !container ){
        container = window.document.documentElement;
      }
      var w = container.clientWidth;
      var h = container.clientHeight;
      return {
        width  : w,
        height : h
      };
    };

    ScrollReveal.prototype.getScrolled = function( container ){
      if ( !container ){
        return {
          x : window.pageXOffset,
          y : window.pageYOffset
        };
      } else {
        var offset = sr.getOffset( container );
        return {
          x : container.scrollLeft + offset.left,
          y : container.scrollTop  + offset.top
        };
      }
    };

    ScrollReveal.prototype.getOffset = function( domEl ){
      var offsetTop    = 0;
      var offsetLeft   = 0;
      var offsetHeight = domEl.offsetHeight;
      var offsetWidth  = domEl.offsetWidth;

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
    };

    ScrollReveal.prototype.isElemVisible = function( elem ){
      var offset     = sr.getOffset( elem.domEl );
      var container  = sr.getContainer( elem.config.container );
      var scrolled   = sr.getScrolled( elem.config.container );
      var vF         = elem.config.viewFactor;

      var elemHeight = offset.height;
      var elemWidth  = offset.width;
      var elemTop    = offset.top;
      var elemLeft   = offset.left;
      var elemBottom = elemTop  + elemHeight;
      var elemRight  = elemLeft + elemWidth;

      return ( confirmBounds() || isPositionFixed() );

      function confirmBounds(){
        var top        = elemTop    + elemHeight * vF;
        var left       = elemLeft   + elemWidth  * vF;
        var bottom     = elemBottom - elemHeight * vF;
        var right      = elemRight  - elemWidth  * vF;

        var viewTop    = scrolled.y + elem.config.viewOffset.top;
        var viewLeft   = scrolled.x + elem.config.viewOffset.left;
        var viewBottom = scrolled.y - elem.config.viewOffset.bottom + container.height;
        var viewRight  = scrolled.x - elem.config.viewOffset.right  + container.width;

        return ( top    < viewBottom )
            && ( bottom > viewTop    )
            && ( left   > viewLeft   )
            && ( right  < viewRight  );
      }

      function isPositionFixed(){
        return ( window.getComputedStyle( elem.domEl ).position === 'fixed' );
      }
    };

    ScrollReveal.prototype.sync = function(){
      if ( sr.history.length ){
        for ( var i = 0; i < sr.history.length; i++ ){
          var record = sr.history[ i ];
          sr.reveal( record.selector, record.config, true );
        };
        sr.init();
      } else {
        console.log('sync() failed: no reveals found.');
      }
      return sr;
    };

    return ScrollReveal;

  })();

  var Tools = (function(){

    Tools.prototype.isObject = function( object ){
      return object !== null && typeof object === 'object' && object.constructor == Object;
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
