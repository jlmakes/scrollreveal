#scrollReveal.js
A simple way to create and maintain how elements fade in, triggered when they enter the viewport. An open-source experiment from [@JulianLloyd](https://twitter.com/julianlloyd).

[![scrollReveal version](https://badge.fury.io/gh/julianlloyd%2FscrollReveal.js.png)](http://badge.fury.io/gh/julianlloyd%2FscrollReveal.js) [![Bitdeli Analytics](https://d2weczhvl823v0.cloudfront.net/julianlloyd/scrollreveal.js/trend.png)](https://bitdeli.com/free)
***
####**[→ View Demo ←](http://julianlloyd.me/scrollreveal)**
***
Installation
------------
> **Disclaimer:** scrollReveal.js is in early development, and breaking changes will likely occur in future updates. Before updating, please refer to the [CHANGELOG](https://github.com/julianlloyd/scrollReveal.js/blob/master/CHANGELOG.md) for details.

#### Download
[scrollReveal.js ](https://github.com/julianlloyd/scrollReveal.js/archive/master.zip)

#### GitHub
`git clone https://github.com/julianlloyd/scrollReveal.js.git`

#### Bower
`bower install scrollReveal.js`

***
Once you have a copy of `scrollReveal.js`, place it in your JavaScript folder, and include the following JavaScript just before the closing `</body>` tag.


```html
  <!-- Everything else… -->

  <script src='{your_JavaScript_path}/scrollReveal.js'></script>
  <script>

      window.scrollReveal = new scrollReveal();

  </script>
</body>
```
Basic Usage
-----------
By adding a `data-scrollReveal` attribute to an element, it will automatically be revealed (using default values) as soon as the element is within the viewport:
```html
<!-- Reveal using defaults. -->
<div data-scrollReveal> Hello world! </div>
```
**But wait!** It’s more fun if you define your own reveal animation parameters, which you can do using using natural, declarative language:
```html
<!-- Reveal using custom parameters. -->
<div data-scrollReveal="enter left and move 50px over 1.33s"> Foo </div>
<div data-scrollReveal="enter from the bottom after 1s"> Bar </div>
<div data-scrollReveal="wait 2.5s and then ease-in-out 100px"> Baz </div>
```

Getting Started
---------------
What you enter into the `data-scrollReveal` attribute is parsed for specific words:

- **keywords** that expect to be followed by a **value**.<br><br>
- **fillers** as natural language sugar. (optional)

#### Keywords and Values
These specific **keyword** / **value** pairs allow you to describe basic reveal animation behavior.
***
**keyword:** `enter` — Controls the vector origin of your reveal animation.<br>
**value:** `top` | `right` | `bottom` | `left`<br><br>
*Example:*
```html
<!-- Reveal your element with a downward motion. -->
<div data-scrollReveal='enter top'> Foo </div>
```
***
**keyword:** `move` — The distance your revealing element travels.<br>
**value:** [ integer ]px.

*Example:*
```html
<div data-scrollReveal='move 24px'> Bar </div>
```
***
**keyword:** `over` — The duration of your reveal animation.<br>
**value:** [ decimal ]s


*Example:*
```html
<div data-scrollReveal='over 1.66s'> Baz </div>
```
***
**keyword:** `after/wait` — The duration before your reveal begins.<br>
**value:** [ decimal ]s


*Example:*
```html
<!-- Both are accepted. -->
<div data-scrollReveal='after 0.33s'> Mel </div>
<div data-scrollReveal='wait 0.33s'> Mel </div>
```

####Combining Keyword/Value Pairs
You can easily combine the above pairs to create more dynamic reveal animations.

*Example:*
```html
<div data-scrollReveal="enter top move 50px"> Foo </div>
<div data-scrollReveal="enter top move 50px wait 0.3s"> Bar </div>
<div data-scrollReveal="enter top move 50px wait 0.6s"> Baz </div>
<div data-scrollReveal="enter top move 50px wait 0.9s"> Mel </div>
```

#### Fillers (optional)
You can use conjoining filler words for more readable language.

- `from`
- `the`
- `and`
- `then`
- `but`
- `with`
- `,`

*Example*:
```html
<!-- These 4 lines are equivalent. -->
<div data-scrollReveal="wait 0.3s, then enter left and move 40px over 2s"> Foo </div>
<div data-scrollReveal="enter from the left after 0.3s, move 40px, over 2s"> Bar </div>
<div data-scrollReveal="enter left move 40px over 2s after 0.3s"> Baz </div>
<div data-scrollReveal="enter left, move 40px, over 2s, wait 0.3s"> Mel </div>

```
Advanced Usage
--------------
####Custom defaults
You can pass an object to the constructor with your desired default configuration.
```html
  <!-- Everything else. -->

  <script src='{your_JavaScript_path}/scrollReveal.js'></script>
  <script>

    // The starting defaults.
    var config = {
            after: '0s',
            enter: 'bottom',
            move: '24px',
            over: '0.66s',
            easing: 'ease-in-out',
            viewportFactor: 0.33,
            reset: false,
            init: true
          };

    window.scrollReveal = new scrollReveal( config );

  </script>
</body>
```
By default `init` is set to `true`, meaning `scrollReveal.init()` fires on instantiation. (This registers DOM elements and prepares them to reveal)<br><br>You may want to set `init` to `false` if you’re working with templates or other generated content, letting you control when `scrollReveal.init()` is first called.<br><br>You can also call this method any time afterwards to re-check all elements in the DOM with `data-scrollReveal` for attributes.

#### Generated HTML
You may have dynamically generated HTML in your use case, (AJAX, templates, other JavaScript libraries, etc.,) so as mentioned above, the scrollReveal object has the `init()` helper method that checks for new elements in the DOM.

*Example:*
```html
  <!-- Everything else. -->

  <script src='{your_JavaScript_path}/scrollReveal.js'></script>
  <script>

      var config = {
              enter: 'bottom',
              move: '40px',
              over: '0.16s',
              reset: true,
              init: false
            };

      window.scrollReveal = new scrollReveal( config );

      // Dummy AJAX return object:
      var data = { newElementHtml: '<div data-scrollReveal> Foo </div>' }

      var container = document.getElementById('#container');
          container.innerHTML( data.newElementHTML );

     // Now check for new elements in the DOM…
     scrollReveal.init();

  </script>
</body>
```


#### Viewport Factor
If set to **0**, the element is considered in the viewport as soon as it enters.<br>
If set to **1**, the element is considered in the viewport when it is fully visible.

*Example:*
```javascript
    var config = {
      viewportFactor: 0.33
    };

    // Your reveal animation triggers after 33% of
    // your element is visible within the viewport.
```

#### Replaying animations
**Keyword:** `reset` — replay reveal animations every time elements enter the viewport.
```html
<!-- Note: The reset keyword works by itself. -->
<div data-scrollReveal="reset"> Foo </div>
```
> **Important Note:** scrollReveal by defaut does not reset reveal animations, and will remove the appended `style` attribute (containing generated CSS) from your elements once the reveal animation is complete.<br><br>However when using `reset` (to prevent flickering in reveal animations), scrollReveal does not remove the appended `style` attribute.<br><br>This means using the `reset` keyword may cause the scrollReveal animation CSS properties to override or conflict with any other CSS transform and transition properties on that element.

#### Controlling Easing
The `move` keyword can be replaced with any one of the following:<br><br>
- `ease-in`
- `ease-out`
- `ease-in-out`

*Example:*
```html
<div data-scrollReveal="after 2s, ease-in 32px and reset over .66s"> Foo </div>
```

Browser Support
---------------
scrollReveal.js does not require jQuery, but does rely on [CSS3 transitions](http://caniuse.com/#search=transition) to power its reveal animations; it has been developed exclusively for **modern browser use only**.

Contributions
-------------
Community feedback and involvement is highly encouraged.
***
#### [→ Open Issues ←](https://github.com/julianlloyd/scrollReveal.js/issues?state=open)
***
#### Special Thanks
scrollReveal.js was inspired by the awesome [cbpScroller.js](http://tympanus.net/codrops/2013/07/18/on-scroll-effect-layout/) by [Mary Lou](https://twitter.com/crnacura). Copyright © 2014 [Codrops](http://tympanus.net/codrops/).

License
-------

The MIT License (MIT)

Copyright © 2014 [Julian Lloyd](https://twitter.com/julianlloyd)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.