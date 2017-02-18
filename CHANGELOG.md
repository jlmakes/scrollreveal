
# Changelog

### 3.3.4 - _2017, February 18th

Includes patchwork up to 3.3.4.

#### Features

- **[#273](https://github.com/jlmakes/scrollreveal.js/issues/273) New Callbacks:** `beforeReveal(el)`
- **[#273](https://github.com/jlmakes/scrollreveal.js/issues/273) New Callback:** `beforeReset(el)`

_Example:_

```js
// Let’s see all 4 together now...
sr.reveal('.foo', {
  beforeReveal: (el) => console.log('Reveal started...'),
  afterReveal: (el) => console.log('Reveal complete.'),
  beforeReset: (el) => console.log('Reset triggered...'),
  afterReset: (el) => console.log('Reset complete.')
})
```

#### Fixes

- *Functionality*: The default `config.container` now recognizes selectors (Fixes [#289](https://github.com/jlmakes/scrollreveal.js/issues/289))
- *Compatibility*: Added missing trailing semi-colon (Fixes [#278](https://github.com/jlmakes/scrollreveal.js/issues/278))

### 3.2.0 — _2016, July 8th_

Includes patchwork up to 3.1.5.

#### Features

- **Reveal Node Lists**: Add support for `Node List` objects as the first parameter of `reveal()`
```js
var elemList = document.querySelectorAll('.selector');
sr.reveal(elemList);
```

- **Version Check**: Easily check which version of ScrollReveal you’re running.
```js
sr.version // e.g. returns 3.2.0
```

#### Fixes

- *Compatibility*: Replace automatic module wrapper with a manual solution (Fixes [#253](https://github.com/jlmakes/scrollreveal.js/issues/253))
- *Functionality*: Fix  `config.distance` values when `config.origin` is `top` or `left`.(Fixes [#270](https://github.com/jlmakes/scrollreveal.js/issues/270))
- *Functionality*: Correctly record the interval argument for  `sync()` (Fixes [#268](https://github.com/jlmakes/scrollreveal.js/issues/268))
- *Functionality*: Fix animation sequence with `config.reset` (Fixes [#241](https://github.com/jlmakes/scrollreveal.js/issues/241))

#### Improvements

- *Compatibility*: Add `requestAnimationFrame` fallback. (Resolves [#267](https://github.com/jlmakes/scrollreveal.js/issues/267))
- *Functionality*: Remove `console.log()` from minified distribution (Fixes [#235](https://github.com/jlmakes/scrollreveal.js/issues/235))

### 3.1.0 — _2016, February 22nd_

Includes patchwork up to 3.0.9.


#### Features

- **Sequences**: New 3rd argument in `reveal()` to automate sequenced animation setup.
```html
<!-- example.html -->
<div class="sequenced"> Foo </div>
<div class="sequenced"> Bar </div>
<div class="sequenced"> Bun </div>
```
```js
// scripts.js
sr.reveal('.sequenced', { reset: false }, 1000);
```

- **Container Selectors**: Add support for `string` selectors to define `config.container`

```js
window sr = ScrollReveal({ container: '.container' });
// or
sr.reveal('.foo', { container: '.fooContainer' });
```

- **Reveal Nodes**: Add support for `Node` objects as the first parameter of `reveal()`

```js
// What you’re used to...
sr.reveal('.myElem');

// New! Pass a Node (works great with React!)
var myElem = document.querySelector('.myElem');
sr.reveal(myElem);

```


#### Fixes

- *Functionality*: Add missing support for `config.mobile` (Fixes [#216](https://github.com/jlmakes/scrollreveal.js/issues/216))
- *Functionality*: Return correct value when checking element visibility. (Fixes [#193](https://github.com/jlmakes/scrollreveal.js/issues/193), [#196](https://github.com/jlmakes/scrollreveal.js/issues/196))
- *Functionality*: Improve runtime for chained `reveal()` calls. (Fixes [#212](https://github.com/jlmakes/scrollreveal.js/issues/212))
- *Compatibility*: Debug Internet Explorer 9. (Fixes [#230](https://github.com/jlmakes/scrollreveal.js/pull/230))
- *Compatibility*: Debug Chrome on iOS. (Fixes [#196](https://github.com/jlmakes/scrollreveal.js/issues/196))
- *Compatibility*: Explicitly reference `window` object.
- *Compatibility*: Adjust AMD configuration for Webpack (Fixes [#209](https://github.com/jlmakes/scrollreveal.js/issues/209))

#### Improvements

- *Functionality*: Overwrite (instead of destroy) existing transition styles. (Resolves [#197](https://github.com/jlmakes/scrollreveal.js/issues/197))
- *Functionality*: Fail silently with `console.log` instead of `console.warn`
- *Performance*: Refactored initialization when using `sync()`
- *Performance*: Improve accuracy of callback timers.

### 3.0.0 — _2015, December 15th_

>**Note:** Version 3 is _not backwards compatible_ with version 2.

Reimagining ScrollReveal for vastly improved flexibility and maintainability! :bow:

#### _Breaking Changes!!_

- `config` object has been completely overhauled.
    - `config.enter` renamed `config.origin`
    - `config.wait` renamed `config.delay`
    - `config.delay` renamed `config.useDelay`
    - `config.over` renamed `config.duration`
    - `config.move` renamed `config.distance`
    - `config.viewport` renamed `config.container`
    - `config.vFactor` renamed `config.viewFactor`
    - `config.complete` renamed `config.afterReveal`
    - Time values are now expected in milliseconds (instead of `string`)
        - e.g. `config.wait = "0.5s"` is now `config.delay = 500`
    - `config.scale` expects value type `number` (instead of `Object`)
        - e.g. `config.scale = { direction: 'up', power: '10%' }` is now `config.scale = 0.9`
    - `config.rotation` axis values require `string` with unit type (instead of `number`)
        - e.g. `config.rotation.x = 10` is now `config.rotation.x = "10deg"`
- ScrollReveal constructor is now capitalized.
    - e.g. `window.sr = ScrollReveal();`
- `data-sr` attribute and all **keywords are no longer used**. Instead, use classes and JavaScript.

_Example using version 2.3.2 (deprecated)_
```html
<!-- old.html -->
<div data-sr="enter bottom over 2s and wait 1s"> Bad Foo </div>
<div data-sr="enter bottom over 2s and wait 1s"> Bad Bar </div>
```
```js
// old.js
window.sr = scrollReveal();
sr.init();
```

_Example using version 3.0.0_
```html
<!-- new.html -->
<div class="myReveal"> Good Foo </div>
<div class="myReveal"> Good Bar </div>
```
```js
// new.js
window.sr = ScrollReveal();
sr.reveal('.myReveal', { origin: 'bottom', duration: 2000, delay: 1000 });
```

#### Features

- **JavaScript API**: All new developer interface. (Resolves [#1](https://github.com/jlmakes/scrollreveal.js/issues/1), [#122](https://github.com/jlmakes/scrollreveal.js/issues/122))
    - Easily configure (and re-configure) multiple reveal sets
    - Makes working with aysnchronous content a breeze
    - Drastically cleaner markup
- **Horizontal Scrolling**: Add support for horizontal scrolling. (Resolves [#184](https://github.com/jlmakes/scrollreveal.js/issues/184))
- **New Callback**: `config.afterReset` — triggers when an element completely resets.

#### Improvements

- *Performance*: 44% smaller, only 2.8KB minified and g-zipped.
- *Functionality*: Reveals now resolve to the element’s computed opacity, instead of  `1`. (Resolves [#185](https://github.com/jlmakes/scrollreveal.js/issues/185))
- *Functionality*: The reliability of callback timers has been greatly improved.

***

### 2.3.2 — _2015, June 15th_

The latest stable build of version 2. See [Legacy Documentation (v2.x)](https://github.com/jlmakes/scrollreveal.js/wiki)

>**Note:** There were some issues publishing this version on Bower, and so `v2.3.2` was patched to  `v2.3.3` to get it back on Bower. There is no meaningful difference between the two.

#### Features

- Support instantiation without `new` keyword. (Pull request [#148](https://github.com/jlmakes/scrollreveal.js/pull/230))

```js
window.sr = new scrollReveal();
// or...
window.sr = scrollReveal();
```

***

### 2.3.0 — _2015, April 25th_

#### Features

- **New Keyword** `opacity` — control animation starting opacity. (Resolves [#95](https://github.com/jlmakes/scrollreveal.js/issues/95))
    - e.g. `data-sr="opacity 0.5"`
- **New Keywords** `vFactor`, `vF` — control element view factor. (Resolves [#94](https://github.com/jlmakes/scrollreveal.js/issues/94), [#142](https://github.com/jlmakes/scrollreveal.js/issues/142))
    - e.g. `data-sr="vF 0.3"`)

#### _(Hardly) Breaking Changes!_
- Removed `hustle` keyword, admit it—you didn’t even know it existed.

***

### 2.2.0 — _2015, March 18th_

#### Features

- **New Keywords** `spin`, `roll`, `flip` — control rotation during animation. ([#138](https://github.com/jlmakes/scrollreveal.js/pull/138))
    - e.g. `data-sr="roll 20deg"`
    - Special thanks to **[@satrun77](https://github.com/satrun77)** ([#119](https://github.com/jlmakes/scrollreveal.js/pull/119))

***

### 2.1.0 — _2014, November 25th_

Includes patchwork up to 2.0.5.

#### Fixes
- *Functionality*: Add missing custom viewport event bindings
- *Functionality*: Add tablets to mobile device user agent regex (Fixes [#81](https://github.com/jlmakes/scrollreveal.js/issues/81))
- *Functionality*: Better handle previously initialized nodes (Fixes [#98](https://github.com/jlmakes/scrollreveal.js/issues/98))
- *Functionality*: Refactor animator. (Fixes [#96](https://github.com/jlmakes/scrollreveal.js/issues/96))
    - Bug source: [setTimeout in for-loop does not print consecutive values](http://stackoverflow.com/questions/5226285/settimeout-in-for-loop-does-not-print-consecutive-values)
- *Compatibility*: Update Bower and NPM `/dist` paths

#### Improvements

- *Performance*: Remove `data-sr` attributes from the DOM that have already registered (Resolves [#100](https://github.com/jlmakes/scrollreveal.js/issues/100))
- *Functionality*: Requires CSS Transition support. (Resolves [#109](https://github.com/jlmakes/scrollreveal.js/issues/109))

***

### 2.0.0 — _2014, October 17th_

A significant re-write of the public beta, based on 8 months of feedback! :bow:

#### _Breaking Changes!!_

- `data-scroll-reveal` attribute renamed to `data-sr`.
- `wait` and `after` keywords were redundant; `after` has been removed.
```html
<!-- Don’t do this anymore... -->
<div data-scroll-reveal="after 1s"> Bad </div>

<!-- Do this :) -->
<div data-sr="wait 1s"> Good </div>
```

#### Features
- **New Keyword**: `scale` — control size during animation.
    - e.g. `data-sr="scale up 20%"`
- **Delay Types**: Control when elements will `wait` using `config.delay`
    - e.g. `onload`, `once`, and `always`
- **Mobile Support**:  `config.mobile` — easily enable/disable ScrollReveal on mobile devices.
- **Custom Viewports**: `config.viewport` — accepts any DOM node as the parent container.
- **New Callback**: `config.complete` — triggers after an element completes its reveal.
