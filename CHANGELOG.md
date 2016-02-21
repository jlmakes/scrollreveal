
# Changelog

### 3.0.0 — _2015, December 15th_

>**Note:** Version 3 is _not backwards compatible_ with version 2.

Reimagining ScrollReveal for vastly improved flexibility and maintainability! :bow:

#### _Breaking Changes!!_

- `config` object has been completely overhauled.
    - `config.enter` renamed `config.origin`
    - `config.wait` renamed `config.delay`
    - `config.delay` renamed `config.delayType`
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
        - e.g. `config.rotation.x = 0` is now `config.rotation.x = "0deg"`
- ScrollReveal constructor is now capitalized.
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

- **JavaScript API**: All new developer interface. (Resolves #1, #122)
- **Horizontal Scrolling**: Add support for horizontal scrolling. (Resolves #184)
- **New Callback**: `config.afterReset` — callback that fires when an element completely resets.

#### Improvements

- **Styles**: Overwrite (instead of destroy) existing transition styles. (Resolves #197)
- **Styles**: Reveal animations now use the element’s computed opacity, instead of  `1`. (Resolves #185)
- **Callbacks**: The reliability of the timers has been greatly improved.

***

### 2.3.2 — _2015, April 25th_

>**Note:** There were some issues with Bower and this version of ScrollReveal, so you will find `v2.3.3` only on Bower, which is merely a patched version of `2.3.2.`

#### Features

- **New Keyword** `opacity` — control animation starting opacity. (e.g. `data-sr="opacity 0.5"`)  (Resolves #95)
- **New Keywords** `vFactor`, `vF` — control element view factor. (e.g. `data-sr="vF 0.3"`) (Resolves #94, #142)
- Support instantiation without the `new` keyword. (Pull request #148 by @bucaran)

#### _(Hardly) Breaking Changes!_
- Remove `hustle` keyword. Admit it, you didn’t even know it existed.

***

### 2.2.0 — _2015, March 18th_

#### Features

- **New Keywords** `spin`, `roll`, `flip` control rotation during animation. (e.g. `data-sr="roll 20deg"`)
    - Original pull request #138 but inspired by @satrun77 (#119)

***

### 2.1.0 — _2014, November 25th_

#### Fixes
- Add missing custom viewport event bindings
- Add tablets to mobile device user agent regex (Fixes #81)
- Better handle previously initialized nodes (Fixes #98)
- Refactor animator. (Fixes #96)
    - Bug source: [setTimeout in for-loop does not print consecutive values](http://stackoverflow.com/questions/5226285/settimeout-in-for-loop-does-not-print-consecutive-values)
- Update Bower and NPM `/dist` paths

#### Improvements

- Remove `data-sr` attributes from the DOM that have already registered (Resolves #100)
- Requires CSS Transition support. (Resolves #109)

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
- **New Keyword**: `scale` — control size during animation. (e.g. `data-sr="scale up 20%"`)
- **Mobile Support**:  `config.mobile` — easily enable/disable ScrollReveal on mobile devices.
- **Custom Viewports**: `config.viewport` — accepts any DOM node as the parent container.
- **Delay Types**: Control when elements will `wait` using `config.delay` (e.g. `onload`, `once`, and `always`)
- **New Callback**: `config.complete` — a function called after an element completes its reveal.
