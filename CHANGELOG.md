###### scrollReveal.js Changelog

### v0.1.2   March 13th, 2014

* Add support for elements with `position: fixed` ([#35](https://github.com/julianlloyd/scrollReveal.js/pull/35))
* Revise `genCSS()` method to create less greedy styles. ([#37](https://github.com/julianlloyd/scrollReveal.js/pull/37))

### v0.1.1   March 6th, 2014

* Fixed a serious bug with `enter top` and `enter left` not correctly recognizing the pixel distance declared with the `move` keyword. **Fixes #13 and #31** (Thanks for catching this [Sherban](https://github.com/sherban1988) and [Danycerone](https://github.com/damycerone).)

### v0.1.0   march 5th, 2014

* scrollReveal.js now has a `dist` folder containing the AMD/CommonJS compatibile library.
* [Gulp](http://gulpjs.com/) has been integrated, facilitating the build process.
* Basic testing using [Testling](https://ci.testling.com/) has been put in place.

Breaking Changes
----------------
scrollReveal is now implemented using the `data-scroll-reveal` attribute, **NOT** `data-scrollReveal`.

###  v0.0.4  February 28th, 2014

* scrollReveal no longer destroys the existing `style` attribute on revealed elements, but instead, now appends the necessary reveal animation styles after any existing styles. **(Fixes #18)**

>**Note:** scrollReveal will still override any existing transition or transform in the `style` attribute.

###  v0.0.3  February 22th, 2014

* removed unecessary styles (with `-moz-` & `-o-`) from css transitions & transforms
* added top-line comment, intending it to be kept after minification

###  v0.0.2  February 13th, 2014

* Added CHANGELOG
* Improved README

What’s New
----------
#### Manual Instantiation
scrollReveal no longer automatically instantiates on the `DOMContentLoaded` event. It now requires that you instantiate it manually.

```html
    <!-- Everything else… -->

  <script src='{your_JavaScript_path}/scrollReveal.js'></script>
  <script>

      window.scrollReveal = new scrollReveal();

  </script>
```
#### Defaults Object

You can now pass your own starting defaults object to the scrollReveal constructor.

```html
<script>

      // The starting defaults.
      var config = {
              enter: 'bottom',
              move: '0',
              over: '0.66s',
              delay: '0s',
              easing: 'ease-in-out',
              viewportFactor: 0.33,
              reset: false,
              init: true
            };

      window.scrollReveal = new scrollReveal( config );

  </script>
```
#### Replay Reveal Animations
Due to popular demand, the `reset` keyword was added. Now, you can configure your animations to replay every time they enter the viewport:

*example*:
```html
<script>
    window.scrollReveal = new scrollReveal( {reset: true} );
</script>
```

>**See it in action:** The [demo page](http://julianlloyd.me/scrollreveal) has been updated with the `reset: true` property.

#### Easing Control
Now you can replace the `move` keyword with easing keywords to control the easing of your reveal animation.

*example*:
```html
<div data-scrollReveal="after 0.33s, ease-out 24px"> Foo </div>
```
