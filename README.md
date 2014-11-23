#scrollReveal.js
[![scrollReveal version](http://img.shields.io/badge/scrollReveal.js-v2.0.5-brightgreen.svg)](http://scrollrevealjs.org) [![License](http://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)

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

How does it work? Just add `data-sr` to an element, and it will reveal as it enters the viewport.
```html
<p data-sr> Chips Ahoy! </p>
```

Taking Control
--------------

You guessed it, the `data-sr` attribute is waiting for _you_ to describe the type of animation you want. It’s as simple as using a few **keywords** and natural language.
```html
<div data-sr="enter left please, and hustle 20px"> Foo </div>
<div data-sr="wait 2.5s and then ease-in-out 100px"> Bar </div>
<div data-sr="enter bottom and scale up 20% over 2s"> Baz </div>
```
What you enter into the `data-sr` attribute is parsed for specific words:

- **Keywords** that expect to be followed by a **value**. (e.g. move 50px)
- **Sugar** (optional) for fun and comprehension. (e.g. and, then, please, etc.)

***

### Recommended Next: [Keywords →](https://github.com/julianlloyd/scrollReveal.js/wiki/Keywords)
