[![ScrollReveal — Easy scroll animations for web and mobile browsers.](https://scrollrevealjs.org/assets/scrollreveal-repo-header.png)](https://scrollrevealjs.org)

[![ScrollReveal Demo](https://scrollrevealjs.org/assets/scrollreveal-demo.png)](https://scrollrevealjs.org)

***

[![Travis CI][travis-image]][travis-url]
[![License][license-image]][license-url]
[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

- 3.3KB minified and Gzipped
- No dependencies
- From the ![heart](http://i.imgur.com/oXJmdtz.gif) of [@jlmakes](https://twitter.com/jlmakes)

[![Build Status](https://saucelabs.com/browser-matrix/jlmakes.svg)](https://saucelabs.com/beta/builds/1180a4d52c2441a4b409ec688d8f596e)

#### Installation

The simplest method is to copy paste this snippet just before your closing `</body>` tag.

```html
<script src="https://unpkg.com/scrollreveal@3.3.2/dist/scrollreveal.min.js"></script>
```

But you can also:

- [Download ZIP](https://github.com/jlmakes/scrollreveal.js/archive/master.zip)
- `npm install scrollreveal`
- `bower install scrollreveal`

#### The Basics

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

#### License

Open source under the [MIT License](https://github.com/jlmakes/scrollreveal.js/blob/master/LICENSE.md). ©2014–2016 Julian Lloyd.

#### Issues and Reporting Bugs

**Please search existing issues, before creating a new one;** every issue is labeled and attended carefully. If you open a duplicate issue, it will be closed immediately.

If you cannot find your issue/bug in a previous ticket, please include details such as your browser, any other 3rd party JavaScript libraries you are using, and ideally a code sample demonstrating the problem. (Try [JSBin](http://jsbin.com/nuqapopefo/1/edit?html,output))

#### Special Thanks

ScrollReveal was inspired by the talented [Manoela Ilic](https://twitter.com/crnacura) and her [cbpScroller.js](http://tympanus.net/codrops/2013/07/18/on-scroll-effect-layout/).

[travis-image]: https://travis-ci.org/jlmakes/scrollreveal.svg?branch=development
[travis-url]: https://travis-ci.org/jlmakes/scrollreveal
[license-image]: https://img.shields.io/badge/license-MIT-1283c3.svg
[license-url]: https://github.com/jlmakes/scrollreveal.js/blob/master/LICENSE.md
[npm-image]: https://img.shields.io/npm/v/scrollreveal.svg?style=flat
[npm-url]: https://npmjs.org/package/scrollreveal
[downloads-image]: https://img.shields.io/npm/dm/scrollreveal.svg?style=flat
[downloads-url]: https://npmjs.org/package/scrollreveal
