/*
            _____                 ________                       __
           / ___/______________  / / / __ \___ _   _____  ____ _/ /
           \__ \/ ___/ ___/ __ \/ / / /_/ / _ \ | / / _ \/ __ `/ /
          ___/ / /__/ /  / /_/ / / / _, _/  __/ |/ /  __/ /_/ / /
         /____/\___/_/   \____/_/_/_/ |_|\___/|___/\___/\__,_/_/    v3.0.0

‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
   Copyright 2014–2016 Julian Lloyd (@jlmakes) Open source under MIT license
————————————————————————————————————————————————————————————————————————————————
    https://scrollrevealjs.org — https://github.com/jlmakes/scrollreveal.js
______________________________________________________________________________*/

(function() {
  var Tools, sr, _requestAnimationFrame;

  this.ScrollReveal = (function() {
    ScrollReveal.prototype.defaults = {
      // Animation
      origin      : 'bottom',
      distance    : '20px',
      duration    : 500,
      delay       : 0,
      rotate      : { x: 0, y: 0, z: 0 },
      opacity     : 0,
      scale       : 0.9,
      easing      : 'cubic-bezier( 0.6, 0.2, 0.1, 1 )',
      // Options
      container   : null,
      mobile      : true,
      reset       : false,
      useDelay    : 'always',
      viewFactor  : 0.2,
      viewOffset  : { top: 0, right: 0, bottom: 0, left: 0 },
      afterReveal : function( domEl ) {},
      afterReset  : function( domEl ) {}
    };

    function ScrollReveal( config ) {
      if ( window == this ) {
        return new ScrollReveal( config );
      }
      sr = this;
      sr.tools = new Tools();
      sr.tools.extend( sr.defaults, config || {} );

      if ( sr.tools.isMobile() && !sr.defaults.mobile ) {
        return false;
      } else if ( !sr.tools.browserSupports('transform') ) {
        return console.warn('Your browser does not support CSS transform.');
      }

      sr.store = {
        elements   : {},
        containers : []
      };
      sr.history     = [];
      sr.counter     = 0;
      sr.blocked     = false;
      sr.initialized = false;
      return sr;
    }

    ScrollReveal.prototype.reveal = function( selector, config, sync ){
      var elements, container, elem, elemId;

      if ( config && config.container ) {
        container = config.container;
      } else {
        container = window.document.documentElement;
      }

      elements = Array.prototype.slice.call( container.querySelectorAll( selector ) );
      if ( !elements.length ) {
        return console.warn( 'reveal("' + selector + '"") returned 0 elements.' );
      }
      for ( var i = 0; i < elements.length; i++ ) {
        elem   = {}
        elemId = elements[ i ].getAttribute('data-sr-id');

        if ( elemId ) {
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

        if ( !elem.revealed ) {
          elem.domEl.setAttribute( 'style',
              elem.styles.inline
            + elem.styles.transform.initial
          );
        }
      }
      if ( !sync ) {
        sr.record( selector, config );
      }
      sr.init();
      return sr;
    };

    ScrollReveal.prototype.configure = function( elem, config ) {
      if ( !elem.config ) {
        elem.config = sr.tools.extendClone( sr.defaults, config );
      } else {
        elem.config = sr.tools.extendClone( elem.config, config );
      }

      if ( elem.config.origin === 'top' || elem.config.origin === 'bottom' ) {
        elem.config.axis = 'Y';
      } else {
        elem.config.axis = 'X';
      }

      if ( elem.config.origin === 'top' || elem.config.origin === 'left' ) {
        elem.config.distance = '-' + elem.config.distance;
      }
    };

    ScrollReveal.prototype.style = function( elem ) {
      var config = elem.config;

      if ( !elem.styles ) {
        elem.styles = {
          transition : {},
          transform  : {}
        };
        elem.styles.inline  = elem.domEl.getAttribute('style') || '';
        elem.styles.inline += '; visibility: visible; ';
        elem.styles.opacity = window.getComputedStyle( elem.domEl ).opacity;
      }

      elem.styles.transition.instant = 'transition: transform ' + config.duration / 1000 + 's ' + config.easing + ' 0s, opacity ' + config.duration / 1000 + 's ' + config.easing + ' 0s; ' +
                       '-webkit-transition: -webkit-transform ' + config.duration / 1000 + 's ' + config.easing + ' 0s, opacity ' + config.duration / 1000 + 's ' + config.easing + ' 0s; ';

      elem.styles.transition.delayed = 'transition: transform ' + config.duration / 1000 + 's ' + config.easing + ' ' + config.delay / 1000 + 's, opacity ' + config.duration / 1000 + 's ' + config.easing + ' ' + config.delay / 1000 + 's; ' +
                       '-webkit-transition: -webkit-transform ' + config.duration / 1000 + 's ' + config.easing + ' ' + config.delay / 1000 + 's, opacity ' + config.duration / 1000 + 's ' + config.easing + ' ' + config.delay / 1000 + 's; ';

      elem.styles.transform.initial = 'transform:';
      elem.styles.transform.target  = 'transform:';
      generateTransform( elem.styles.transform );

      elem.styles.transform.initial += ' -webkit-transform:';
      elem.styles.transform.target  += ' -webkit-transform:';
      generateTransform( elem.styles.transform );

      function generateTransform( transform ) {
        if ( parseInt( config.distance ) ) {
          transform.initial += ' translate' + config.axis + '(' + config.distance + ')';
          transform.target  += ' translate' + config.axis + '(0)';
        }
        if ( config.scale ) {
          transform.initial += ' scale(' + config.scale + ')';
          transform.target  += ' scale(1)';
        }
        if ( config.rotate.x ) {
          transform.initial += ' rotateX(' + config.rotate.x + 'deg)';
          transform.target  += ' rotateX(0)';
        }
        if ( config.rotate.y ) {
          transform.initial += ' rotateY(' + config.rotate.y + 'deg)';
          transform.target  += ' rotateY(0)';
        }
        if ( config.rotate.z ) {
          transform.initial += ' rotateZ(' + config.rotate.z + 'deg)';
          transform.target  += ' rotateZ(0)';
        }
        transform.initial += '; opacity: ' + config.opacity + ';';
        transform.target  += '; opacity: ' + elem.styles.opacity + ';';
      }
    };

    ScrollReveal.prototype.updateStore = function( elem, selector, config ) {
      var container = elem.config.container;
      if ( container && sr.store.containers.indexOf( container ) == -1 ) {
        sr.store.containers.push( elem.config.container );
      }
      sr.store.elements[ elem.id ] = elem;
    };

    ScrollReveal.prototype.record = function( selector, config ) {
      var record = {
        selector : selector,
        config   : config
      };
      sr.history.push( record );
    };

    ScrollReveal.prototype.init = function() {
      sr.animate();
      for ( var i = sr.store.containers.length - 1; i >= 0; i-- ) {
        sr.store.containers[ i ].addEventListener( 'scroll', sr.handler );
        sr.store.containers[ i ].addEventListener( 'resize', sr.handler );
      }
      if ( !sr.initialized ){
        window.addEventListener( 'scroll', sr.handler );
        window.addEventListener( 'resize', sr.handler );
        sr.initialized = true;
      }
      return sr;
    };

    ScrollReveal.prototype.handler = function() {
      if ( !sr.blocked ) {
        sr.blocked = true;
        _requestAnimationFrame( sr.animate );
      }
    };

    ScrollReveal.prototype.animate = function() {
      var elem, visible;

      sr.tools.forOwn( sr.store.elements, function( elemId ) {
        elem    = sr.store.elements[ elemId ];
        visible = sr.isVisible( elem );
        if ( visible && !elem.revealed ) {

          if ( elem.config.useDelay === 'always'
          || ( elem.config.useDelay === 'onload' && !sr.initialized )
          || ( elem.config.useDelay === 'once'   && !elem.seen ) ) {
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

        } else if ( !visible && elem.config.reset && elem.revealed ){
          elem.domEl.setAttribute( 'style',
              elem.styles.inline
            + elem.styles.transform.initial
            + elem.styles.transition.instant
          );
          queueCallback( 'reset', elem );
        }
      });

      sr.blocked = false;

      function queueCallback( type, elem ) {
        var elapsed  = 0;
        var duration = 0;
        var callback = 'after';

        switch ( type ) {
          case 'reveal':
            duration = elem.config.duration + elem.config.delay;
            callback += 'Reveal';
            break;
          case 'reset':
            duration = elem.config.duration;
            callback += 'Reset';
            break;
        }

        if ( elem.timer ) {
          elapsed = Math.abs( elem.timer.started - new Date() );
          window.clearTimeout( elem.timer.clock );
        }

        elem.timer = { started: new Date() };

        elem.timer.clock = window.setTimeout(function() {
          elem.config[ callback ]( elem.domEl );
          elem.timer = null;
        }, duration - elapsed );
        return type === 'reveal' ? elem.revealed = true : elem.revealed = false;
      }
    };

    ScrollReveal.prototype.isVisible = function( elem ) {
      var config, rect, viewable;
      var viewport = {
        width  : window.document.documentElement.clientWidth,
        height : window.document.documentElement.clientHeight
      };
      if ( elem.config.container ) {
        var container = elem.config.container.getBoundingClientRect();
        viewable = {
          top    : sr.tools.clamp( 0, container.top,    viewport.height ),
          right  : sr.tools.clamp( 0, container.right,  viewport.width  ),
          bottom : sr.tools.clamp( 0, container.bottom, viewport.height ),
          left   : sr.tools.clamp( 0, container.left,   viewport.width  )
        };
      } else {
        viewable = {
          top    : 0,
          right  : viewport.width,
          bottom : viewport.height,
          left   : 0
        }
      }
      rect   = elem.domEl.getBoundingClientRect();
      config = elem.config;
      return (
        rect.top    + ( rect.height * config.viewFactor ) < viewable.bottom - config.viewOffset.bottom &&
        rect.right  - ( rect.width  * config.viewFactor ) > viewable.left   + config.viewOffset.left   &&
        rect.bottom - ( rect.height * config.viewFactor ) > viewable.top    + config.viewOffset.top    &&
        rect.left   + ( rect.width  * config.viewFactor ) < viewable.right  - config.viewOffset.right
      );
    };

    ScrollReveal.prototype.sync = function() {
      for ( var i = 0; i < sr.history.length; i++ ) {
        var record = sr.history[i];
        sr.reveal( record.selector, record.config, true );
      };
      return sr;
    };

    return ScrollReveal;

  })();

  var Tools = (function() {

    Tools.prototype.clamp = function( min, num, max ){
      return Math.min( Math.max( min, num ), max );
    };

    Tools.prototype.isObject = function( object ){
      return object !== null && typeof object === 'object' && object.constructor == Object;
    };

    Tools.prototype.forOwn = function( object, callback ) {
      if ( !this.isObject( object ) ){
        throw new TypeError( 'Expected "object", but received "' + typeof object + '".' );
      } else {
        for ( var property in object ) {
          if ( object.hasOwnProperty( property ) ) {
            callback( property );
          }
        }
      }
    };

    Tools.prototype.extend = function( target, source ) {
      this.forOwn( source, function( property ) {
        if ( this.isObject( source[ property ] ) ) {
          if ( !target[ property ] || !this.isObject( target[ property ] ) ) {
            target[ property ] = {};
          }
          this.extend( target[ property ], source[ property ] );
        } else {
          target[ property ] = source[ property ];
        }
      }.bind( this ));
      return target;
    };

    Tools.prototype.extendClone = function( target, source ) {
      return this.extend( this.extend( {}, target ), source );
    };

    Tools.prototype.isMobile = function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent );
    };

    Tools.prototype.browserSupports = function( feature ) {
      var sensor    = document.createElement('sensor');
      var cssPrefix = 'Webkit,Moz,O,'.split(',');
      var tests     = ( feature + cssPrefix.join( feature + ',' ) ).split(',');

      for ( var i = 0; i < tests.length; i++ ){
        if ( !sensor.style[ tests[ i ] ] === '' ) {
          return false;
        }
      }
      return true;
    };

    function Tools(){};
    return Tools;

  })();

  var _requestAnimationFrame = this.requestAnimationFrame       ||
                               this.webkitRequestAnimationFrame ||
                               this.mozRequestAnimationFrame;

}).call( this );
