#Changelog

##### 0.0.2

Breaking Changes
----------------
#### Renaming Attributes
The `scrollreveal` attribute has changed to `scrollReveal` (updated with camel case) to remain consistent with it’s usage elsewhere. If you’re updating to scrollReveal v0.0.2, make sure your data-attributes are correctly named.
<br><br>
***
<br><br>
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
              viewportFactor: 0.33,
              reset: false,
              init: true
            };

      window.scrollReveal = new scrollReveal( config );

  </script>
```
#### Reply Your Animations
Due to popular demand, the `reset` keyword was added. Now, you can configure your animations to replay every time they enter the viewport:

*example*:
```html
<script>
    window.scrollReveal = new scrollReveal( {reset: true} );
</script>
```

>**See it in action:** The [demo page](http://julianlloyd.me/scrollreveal) has been updated with the `reset: true`
<br><br>

#### Easing Control
Now you can replace the `move` keyword with easing keywords to control the easing of your reveal animation.

*example*:
```html
<div data-scrollReveal="after 0.33s, ease-out 24px"> Foo </div>
```