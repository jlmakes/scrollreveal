###### scrollReveal.js Changelog

###  v0.0.3  February 22th, 2014

* removed `-moz-` & `-o-` from css transitions & transforms
* added top-line comment, intending it to be kept after minification

###  v0.0.2  February 13th, 2014

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
