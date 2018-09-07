<p align="center">
	<a href="https://scrollrevealjs.org" title="Visit ScrollReveal home page">
		<img src="https://scrollrevealjs.org/img/logomark.svg" alt="ScrollReveal" width="120">
	</a>
</p>
<br>
<p align="center">
	<a href="https://scrollrevealjs.org" title="Visit ScrollReveal home page">
		<img width="200" src="https://scrollrevealjs.org/img/scrollreveal-logotype-dark.svg" alt="ScrollReveal">
	</a>
</p>
<p align="center">Animate elements as they scroll into view.</p>

<p align="center">
	<a href="https://travis-ci.org/jlmakes/scrollreveal">
		<img src="https://img.shields.io/travis/jlmakes/scrollreveal.svg" alt="Build status">
	</a>
	<a href="https://www.npmjs.com/package/scrollreveal">
		<img src="https://img.shields.io/npm/dm/scrollreveal.svg" alt="Monthly downloads">
	</a>
	<a href="https://www.npmjs.com/package/scrollreveal">
		<img src="https://img.shields.io/npm/v/scrollreveal.svg" alt="Version">
	</a>
	<img src="https://img.shields.io/badge/min+gzip-5.6_kB-blue.svg" alt="5.6 kB min+gzip">
	<a href="https://opensource.org/licenses/GPL-3.0">
		<img src="https://img.shields.io/badge/license-GPLv3-blue.svg" alt="GPLv3 License">
	</a>
</p>

<p align="center">
	<a href="https://saucelabs.com/u/scrollreveal">
		<img src="https://saucelabs.com/browser-matrix/scrollreveal.svg" alt="Browser compatibility matrix" width="100%">
	</a>
</p>

<br>

<br>

# Introduction

ScrollReveal is a JavaScript library for easily animating elements as they enter/leave the viewport. It was designed to be robust and flexible, but hopefully you’ll be surprised below at how easy it is to pick up.

<br>

# Installation

## Browser

A simple and fast way to get started is to include this script on your page:

```html
<script src="https://unpkg.com/scrollreveal"></script>
```

This will create the global variable `ScrollReveal`

> Be careful using this method in production. Without specifying a fixed version number, Unpkg may delay your page load while it resolves the latest version. Learn more at [unpkg.com](https://unpkg.com)

## Module

```bash
npm install scrollreveal
```

#### CommonJS

```js
const ScrollReveal = require('scrollreveal')
```

#### ES2015

```js
import ScrollReveal from 'scrollreveal'
```

<br>

# Usage

Installation provides us with the constructor function [`ScrollReveal()`](https://scrollrevealjs.org/api/constructor.html). Calling this function returns the ScrollReveal instance, the “brain” behind the magic.

> ScrollReveal employs the singleton pattern; no matter how many times the constructor is called, it will always return the same instance. This means we can call it anywhere, worry-free.

There’s a lot we can do with this instance, but most of the time we’ll be using the [`reveal()`](https://scrollrevealjs.org/api/reveal.html) method to create animation. Fundamentally, this is how to use ScrollReveal:

```html
<h1 class="headline">
    Widget Inc.
</h1>
```

```js
ScrollReveal().reveal('.headline')
```

**🔎 See this demo live on [JSBin](http://jsbin.com/jufohaxonu/edit?html,output)**

<br>

---

### The full documentation can be found at [https://scrollrevealjs.org](https://scrollrevealjs.org)

> If you’re using an older version of ScrollReveal, you can find legacy documentation in the [wiki](https://github.com/scrollreveal/scrollreveal/wiki)

---

<br>

<a href="https://scrollrevealjs.org/pricing/" title="Visit ScrollReveal pricing page">
	<img align="right" height="300" src="https://scrollrevealjs.org/img/license.svg" alt="Commercial License Badge">
</a>

<br>

# License

Licensed under the GNU General Public License 3.0 for compatible open source projects and non-commercial use.

**For commercial sites, themes, projects, and applications, keep your source code private/proprietary by purchasing a [Commercial License](https://scrollrevealjs.org/pricing/).**

<br>

Copyright 2018 Fisssion LLC
