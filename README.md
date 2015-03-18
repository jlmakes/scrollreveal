#scrollReveal.js
[![scrollReveal version](http://img.shields.io/badge/scrollReveal.js-v2.2.0-brightgreen.svg)](http://scrollrevealjs.org) [![License](http://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)

### Easily reveal elements as they enter the viewport.

 - Developed for modern browsers
 - **3.2KB** minified and Gzipped
 - An open-source project by [Julian Lloyd](https://twitter.com/julianlloyd)

***

### [→ See Demo ←](http://scrollrevealjs.org/)

***

Installation
------------

Please use which ever is most comfortable:

- [Download ZIP](https://github.com/julianlloyd/scrollReveal.js/archive/master.zip)
- `git clone https://github.com/julianlloyd/scrollReveal.js.git`
- `bower install scrollReveal.js`
- `npm install scrollreveal`

Once you’ve got `scrollReveal.min.js` into your project’s JavaScript directory, let’s instantiate it!

```html
<!DOCTYPE html>
<html>
  <body>

    <!-- All your stuff up here... -->

    <script src='/js/scrollReveal.min.js'></script>
    <script>

      window.sr = new scrollReveal();

    </script>
  </body>
</html>
```

Basic Usage
-----------

How does it work? Just add `data-sr` to an element, and it will reveal (using default values) as it enters the viewport.
```html
<p data-sr> Chips Ahoy! </p>
```

Taking Control
--------------

To override default values, scrollReveal uses special **keyword** / **value** pairs (e.g. `move 50px`) allowing you to customize the animation style.
```html
<div data-sr="enter left, hustle 20px"> Foo </div>
<div data-sr="wait 2.5s, ease-in-out 100px"> Bar </div>
<div data-sr="move 16px scale up 20%, over 2s"> Baz </div>
<div data-sr="enter bottom, roll 45deg, over 2s"> Bun </div>
```

***

### Recommended Next: [Keywords →](https://github.com/julianlloyd/scrollReveal.js/wiki/Keywords)
