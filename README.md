[![ScrollReveal — Easy scroll animations for web and mobile browsers.](https://scrollrevealjs.org/assets/scrollreveal-repo-header.png)](https://scrollrevealjs.org)

[![ScrollReveal Demo](https://scrollrevealjs.org/assets/scrollreveal-demo.png)](https://scrollrevealjs.org)

***

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

- 2.8KB minified and Gzipped
- No dependencies
- From the ![heart](http://i.imgur.com/oXJmdtz.gif) of [@jlmakes](https://jlmak.es)

***

## 1. Getting Started

#### 1.1. Installation

The simplest method is to copy paste this snippet just before your closing `</body>` tag.

```html
<script src="https://cdn.jsdelivr.net/scrollreveal.js/3.0.9/scrollreveal.min.js"></script>
```

But you can also:

- [Download ZIP](https://github.com/jlmakes/scrollreveal.js/archive/master.zip)
- `npm install scrollreveal`
- `bower install scrollreveal`

#### 1.2. The Basics

The `reveal()` method is the primary API, and makes it easy to create and manage various types of animations.

```html
<!-- HTML -->
<div class="foo"> Foo </div>
<div class="bar"> Bar </div>
```
```js
// JavaScript
window.sr = ScrollReveal();
sr.reveal('.foo');
sr.reveal('.bar');
```
#### 1.3. Method Chaining

The ScrollReveal constructor, and it's primary methods all support chaining.
```js
window.sr = ScrollReveal();
sr.reveal('.foo');
sr.reveal('.bar');

// Is the same as...
window.sr = ScrollReveal().reveal('.foo, .bar');
```

## 2. Configuration
Passing a configuration object to `ScrollReveal()` changes the defaults for all reveals, and passing `reveal()` a configuration object customizes that reveal set further.

#### 2.1. Practical Example
```js
// Changing the defaults
window.sr = ScrollReveal({ reset: true });

// Customizing a reveal set
sr.reveal( '.foo', { duration: 200 } );
```

#### 2.2. The Starting Defaults
```js
//            'bottom', 'left', 'top', 'right'
origin      : 'bottom',

//            Can be any valid CSS distance, e.g. '5rem', '10%', '20vw', etc.
distance    : '20px',

//            Time in milliseconds.
duration    : 500,
delay       : 0,

//            Starting angles in degrees, will transition from these values to 0 in all axes.
rotate      : { x: 0, y: 0, z: 0 },

//            Starting opacity value, before transitioning to the computed opacity.
opacity     : 0,

//            Starting scale value, will transition from this value to 1
scale       : 0.9,

//            Accepts any valid CSS easing, e.g. 'ease', 'ease-in-out', 'linear', etc.
easing      : 'cubic-bezier(0.6, 0.2, 0.1, 1)',

//            When null, `<html>` is assumed to be the reveal container. You can pass a
//            DOM node as a custom container, e.g. document.querySelector('.fooContainer')
//            or a selector, e.g. '.fooContainer'
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

//            Change when an element is considered in the viewport. The default value
//            of 0.20 means 20% of an element must be visible for its reveal to occur.
viewFactor  : 0.2,

//            Pixel values that alter the container boundaries.
//            e.g. Set `{ top: 48 }`, if you have a 48px tall fixed toolbar.
//            --
//            Visual Aid: https://scrollrevealjs.org/assets/viewoffset.png
viewOffset  : { top: 0, right: 0, bottom: 0, left: 0 },

//            Callbacks that fire for each completed element reveal, and if
//            `config.reset = true`, for each completed element reset. When creating your
//            callbacks, remember they are passed the element’s DOM node that triggered
//            it as the first argument.
afterReveal : function(domEl) {},
afterReset  : function(domEl) {}
```

## 3. Advanced

#### 3.1. Override Configurations

`reveal()` is equipped to handle calls on the same element, so it's easy to override element configuration.

```html
<div class="foo"> Foo </div>
<div class="foo" id="chocolate"> Chip </div>
```
```js
var fooReveal = {
  delay    : 200,
  distance : '90px',
  easing   : 'ease-in-out',
  rotate   : { z: 10 },
  scale    : 1.1
};

window.sr = ScrollReveal();
sr.reveal( '.foo', fooReveal );
sr.reveal( '#chocolate', { delay: 500, scale: 0.9 } );
```

#### 3.2. Custom/Multiple Containers

The default container is the viewport, but you assign any container to any reveal set.

>**Tip:** ScrollReveal works just as well with horizontally scrolling containers too!

```html
<div id="fooContainer">
  <div class="foo"> Foo 1 </div>
  <div class="foo"> Foo 2 </div>
  <div class="foo"> Foo 3 </div>
</div>

<div id="barContainer">
  <div class="bar"> Bar 1 </div>
  <div class="bar"> Bar 2 </div>
  <div class="bar"> Bar 3 </div>
</div>
```
```js
var fooContainer = document.getElementById('fooContainer');
var barContainer = document.getElementById('barContainer');

window.sr = ScrollReveal();
sr.reveal( '.foo', { container: fooContainer } );
sr.reveal( '.bar', { container: barContainer } );
```

#### 3.3. Asynchronous Content

The `sync()` method updates asynchronously loaded content with any existing reveal sets.

_Example:_

```html
<!-- index.html -->
<div id="container">
  <div class="foo">foo</div>
  <div class="foo">foo</div>
  <div class="foo">foo</div>
</div>

<!-- ajax.html -->
<div class="foo">foo async</div>
<div class="foo">foo async</div>
<div class="foo">foo async</div>
```
```js
var fooContainer, content, sr, xmlhttp;

fooContainer = document.getElementById('fooContainer');

sr = ScrollReveal();
sr.reveal( '.foo', { container: fooContainer } );

// Setup a new asynchronous request...
xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if ( xmlhttp.readyState == XMLHttpRequest.DONE ) {
    if ( xmlhttp.status == 200 ) {

      // Turn our response into HTML...
      var content = document.createElement('div');
      content.innerHTML = xmlhttp.responseText;
      content = content.childNodes;

      // Add each element to the DOM...
      for ( var i = 0; i < content.length; i++ ) {
        fooContainer.appendChild( content[ i ]);
      };

      // Finally!
      sr.sync();
    }
  }
}

xmlhttp.open('GET', 'ajax.html', true);
xmlhttp.send();
```

## 4. Tips

#### 4.1. Order Matters

It’s important that ScrollReveal be called (as close to) last in your page as possible, so that:

- Elements on the page have loaded
- Any other 3rd party libraries have had a chance to run
- Any other styles added to your elements wont be overwritten

_Example:_

```html
<!DOCTYPE html>
<html>
  <body>

    <!-- All the things... -->

    <script src="js/scrollreveal.min.js"></script>
    <script>
      window.sr = ScrollReveal();
    </script>
  </body>
</html>
```

#### 4.2. Improve User Experience

In most cases, your elements will start at `opacity: 0` so they can fade in. However, since JavaScript loads after the page begins rendering, you might see your elements flickering as they begin rendering before being hidden by ScrollReveal's JavaScript.

The ideal solution is to **set your reveal elements visibility to hidden** in the `<head>` of your page, to ensure they render hidden while your JavaScript loads:

_Continuing our example from 4.1._
```html
<!DOCTYPE html>
<html class="no-js">
  <head>
    <script>
      // Change <html> classes if JavaScript is enabled
      document.documentElement.classList.remove('no-js');
      document.documentElement.classList.add('js');
    </script>
    <style>
      /* Ensure elements load hidden before ScrollReveal runs */
      .js .fooReveal { visibility: hidden; }
    </style>
  </head>
  <body>

    <!-- All the things... -->

    <script src="js/scrollreveal.min.js"></script>
    <script>
      window.sr = ScrollReveal();
      sr.reveal('.fooReveal');
    </script>
  </body>
</html>
```
>**Note:** If you prefer not to put styles in the `<head>` of your page, including this style in your primary stylesheet will still help with element flickering since your CSS will likely load before your JavaScript.

#### 4.3. Add Perspective to 3D Rotation

ScrollReveal supports 3d rotation out of the box, but you may want to emphasize the effect by specifying a perspective property on your container.

_Continuing our example from 4.2._
```html
<!DOCTYPE html>
<html class="no-js">
  <head>
    <script>
      // Change <html> classes if JavaScript is enabled
      document.documentElement.classList.remove('no-js');
      document.documentElement.classList.add('js');
    </script>
    <style>
      .js .fooReveal { visibility: hidden; }
      .fooContainer { perspective: 800px; }
    </style>
  </head>
  <body>

    <div class="fooContainer">
      <div class="fooReveal"> Foo </div>
      <div class="fooReveal"> Foo </div>
      <div class="fooReveal"> Foo </div>
    </div>

    <script src="js/scrollreveal.min.js"></script>
    <script>
      window.sr = ScrollReveal();
      sr.reveal( '.fooReveal', { rotate: {x: 65} } );
  </script>
  </body>
</html>
```

## 5. Appendix

Open source under the [MIT License](http://img.shields.io/badge/License-MIT-1a2434.svg). ©2014–2016 Julian Lloyd.

#### 5.1. Browser Compatibility

ScrollReveal works on any JavaScript enabled browser that supports both [CSS Transform](http://caniuse.com/#search=transform) and [CSS Transition](http://caniuse.com/#search=transitions). This includes Internet Explorer 10, and most modern desktop and mobile browsers.

#### 5.2. Issues and Reporting Bugs

**Please search existing issues, before creating a new one;** every issue is labeled and attended carefully. If you open a duplicate issue, it will be closed immediately.

If you cannot find your issue/bug in a previous ticket, please include details such as your browser, any other 3rd party JavaScript libraries you are using, and ideally a code sample demonstrating the problem. (Try [JSBin](http://jsbin.com/ladutil/edit?html,output))

#### 5.3. Contributing

Feeling inspired? Please contribute! Optimizations, compatibility and bug fixes are greatly preferred over new features, but don’t be shy. One thing sorely missing from ScrollReveal right now is a test suite.

#### 5.4. Showcase

Here are some cool sites using ScrollReveal:

- [Sequoia Capital](https://www.sequoiacap.com)
- [Andrius Petravic](http://petravic.us/)
- [ISPG Co.](http://www.ispg.co/)
- [White Rabit Express](https://www.whiterabbitexpress.com/)

Want to see your page here? Please send me your work (or of others) using ScrollReveal on Twitter ([@jlmakes](https://twitter.com/jlmakes))

#### 5.5. Special Thanks

ScrollReveal was inspired by the talented [Manoela Ilic](https://twitter.com/crnacura) and her [cbpScroller.js](http://tympanus.net/codrops/2013/07/18/on-scroll-effect-layout/).

[npm-image]: https://img.shields.io/npm/v/scrollreveal.svg?style=flat
[npm-url]: https://npmjs.org/package/scrollreveal
[downloads-image]: https://img.shields.io/npm/dm/scrollreveal.svg?style=flat
[downloads-url]: https://npmjs.org/package/scrollreveal
