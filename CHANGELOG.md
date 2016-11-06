# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/)

## [Unreleased]

Details coming soon...

## [3.3.2] - 2016-10-02

### Changed
- Updated Starting Defaults section in README. [#273](https://github.com/jlmakes/scrollreveal/issues/273)

### Fixed
- Using a selector to define a default container during instantiation now works. [#289](https://github.com/jlmakes/scrollreveal/issues/289)

## [3.3.1] - 2016-07-22

### Fixed
- Instance variable `version` updated with correct library version.

## [3.3.0] - 2016-07-22

### Added
- New callback `beforeReveal(el)`. [#273](https://github.com/jlmakes/scrollreveal/issues/273)
- New callback `beforeReset(el)`. [#273](https://github.com/jlmakes/scrollreveal/issues/273)

## [3.2.0] - 2016-07-08

### Added
- New `isNodeList()` method added to `Tools`.
- New `version` instance variable contains library version.
- HTML Collections are now supported as the first argument in `reveal()`. [#246](https://github.com/jlmakes/scrollreveal/issues/246)
- Added fallback for `requestAnimationFrame`. [#267](https://github.com/jlmakes/scrollreveal/issues/267)

### Changed
- Updated Starting Defaults section in README.

### Fixed
- Calling `reveal()` multiple times on an element with `config.origin` as `top` or `left` no longer produces invalid CSS. [#270](https://github.com/jlmakes/scrollreveal/issues/270)
- Refactored AMD/CommonJS module wrapper to work with Codekit. [#253](https://github.com/jlmakes/scrollreveal/issues/253)

## [3.1.5] - 2016-07-06

### Fixed
- `sync()` method now properly supports  sequences.

## [3.1.4] - 2016-03-28

### Changed
- Added `console.log` calls back to non-minified distribution. [#235](https://github.com/jlmakes/scrollreveal/issues/235)

## [3.1.3] - 2016-03-28

### Removed
- Removed `console.log` calls from distribution. [#235](https://github.com/jlmakes/scrollreveal/issues/235)

## [3.1.2] - 2016-03-23

### Fixed
- Removed stray quotation mark in `reveal()` error message.

## [3.1.1] - 2016-03-08

### Fixed
- `config.reset` now works properly with sequences. [#241](https://github.com/jlmakes/scrollreveal/issues/241)

## [3.1.0] - 2016-03-07

### Added
- New `isNode()` method added to `Tools`.
- HTML elements are now supported as the first argument in `reveal()`.
- Selector strings assigned to `config.container` are now supported.
- `reveal()` now accepts an `interval` as it's last argument to create sequences. [#86](https://github.com/jlmakes/scrollreveal/issues/86) [#180](https://github.com/jlmakes/scrollreveal/issues/180) [#187](https://github.com/jlmakes/scrollreveal/issues/187) [#215](https://github.com/jlmakes/scrollreveal/issues/215) [#234](https://github.com/jlmakes/scrollreveal/issues/234)
- New section on sequenced animations added to README.

### Changed
- Messages logged to console are now prepended with `ScrollReveal: ` for clarity.
- Revised and renamed `supported()` method to `isSupported()`.
- Updated Custom Containers section in README with an example using a selector.
- Updated Tips section in README.

### Fixed
- Added semi-colon before global IIFE to improve reliability. [#228](https://github.com/jlmakes/scrollreveal/issues/228)
- The existence of `console.log` is now confirmed for IE9. [#230](https://github.com/jlmakes/scrollreveal/issues/230)
- Typos, indentation and semicolons corrected in README.

## [3.0.9] - 2016-01-14

### Changed
- Updated example site links in the README.

### Fixed
- Fixed operator mismatch inside `supported()`. [#220](https://github.com/jlmakes/scrollreveal/issues/220)

## [3.0.8] - 2016-01-13

### Changed
- Public methods now verify that ScrollReveal is supported.

### Fixed
- Updated Tips section in README.

## [3.0.7] - 2016-01-13

### Added
- Added brower support information to README. [#219](https://github.com/jlmakes/scrollreveal/issues/219)

### Changed
- `console.log` is now used instead of `console.warn`. [#215](https://github.com/jlmakes/scrollreveal/issues/215)
- Moved `tools.isSupported` method to `ScrollReveal.prototype.supported`.
- Updated the configuration and tips documentation in the README.

### Removed
- The `init()` method was removed.

### Fixed
- Using `config.mobile` in `reveal()` now works. [#216](https://github.com/jlmakes/scrollreveal/issues/216)

## [3.0.6] - 2016-01-02

### Fixed
- Custom default containers are now used.
- Critical issues affecting Chrome on iOS were (finally) solved. [#196](https://github.com/jlmakes/scrollreveal/issues/196)
- Revisited `3.0.4` changes to chaining `reveal()` calls. [#212](https://github.com/jlmakes/scrollreveal/issues/212)

## [3.0.5] - 2015-12-30

### Fixed
- Fixed compatibility issues with Webpack. [#209](https://github.com/jlmakes/scrollreveal/issues/209)

## [3.0.4] - 2015-12-30

### Fixed
- Squashed Webkit browser bugs due to syntax errors. [#208](https://github.com/jlmakes/scrollreveal/issues/208)
- Chaining `reveal()` calls no longer prematurely initialize animation.
- Cleaned up README typos, and stale reference to `config.wait`.

## [3.0.3] - 2015-12-22

### Changed
- `reveal()` and `sync()` now return the ScrollReveal instance even on failure. [#198](https://github.com/jlmakes/scrollreveal/issues/198)

## [3.0.2] - 2015-12-22

### Added
- Added `bower.json` to release package. [#199](https://github.com/jlmakes/scrollreveal/issues/199)

### Fixed
- Preexisting CSS transition styles are no longer destroyed. [#197](https://github.com/jlmakes/scrollreveal/issues/197)

## [3.0.1] - 2015-12-21

### Changed
- Updated Getting Started section in the README.

### Fixed
- Hard learned NPM and Bower issues related to release management were endured.
- Issues related to element visibility and animation behavior were addressed. [#193](https://github.com/jlmakes/scrollreveal/issues/193) [#196](https://github.com/jlmakes/scrollreveal/issues/196)

## [3.0.0] - 2015-12-15

This version marks a significant change in how developers use ScrollReveal, introducing a JavaScript API to replace the inline attribute parser. It's a big shift, but prioritizes maintainability and flexibility over the novelty of natural language parsing.

### Added
- New method `reveal()`. [#1](https://github.com/jlmakes/scrollreveal/issues/1) [#122](https://github.com/jlmakes/scrollreveal/issues/122)
- New method `sync()`.
- New callback `config.afterReset`.
- Horizontal scrolling is now supported.  [#184](https://github.com/jlmakes/scrollreveal/issues/184)

### Changed
- **Breaking:** `config.enter` renamed `config.origin`.
- **Breaking:** `config.wait` renamed `config.delay`.
- **Breaking:** `config.delay` renamed `config.useDelay`.
- **Breaking:** `config.over` renamed `config.duration`.
- **Breaking:** `config.move` renamed `config.distance`.
- **Breaking:** `config.viewport` renamed `config.container`.
- **Breaking:** `config.vFactor` renamed `config.viewFactor`.
- **Breaking:** `config.complete` renamed `config.afterReveal`.
- **Breaking:** Time values are now expected in milliseconds (instead of `string`).
- **Breaking:** `config.scale` expects value type `number` (instead of `object`).
- **Breaking:** `config.rotation` axis values require `string` with unit type (instead of `number`).
- **Breaking:** ScrollReveal constructor is now capitalized.
- Reveals now resolve to element's computed opacity, instead of `1`. [#185](https://github.com/jlmakes/scrollreveal/issues/185)

### Removed
- ScrollReveal no longer recognizes `data-sr` attributes.

### Fixed
- Improved reliability of callback timers.

## [2.3.2] - 2015-06-15

### Changed
- Updated `bower.json` syntax. [#150](https://github.com/jlmakes/scrollreveal/issues/150)

## [2.3.1] - 2015-06-04

### Added
- Simple instantiation (without `new` keyword) is now supported. [#148](https://github.com/jlmakes/scrollreveal/issues/148)

## [2.3.0] - 2015-04-25

### Added
- New keyword `vFactor` and alias `vF` control when an element is considered visible.
- New keyword `opacity` controls starting opacity.

### Removed
- The easing keyword `hustle` was removed.

## [2.2.0] - 2015-03-18

### Added
- New keyword `spin` controls yaw.
- New keyword `roll` controls roll.
- New keyword `flip` controls pitch.

### Changed
- Improved Basic Usage examples in README.

## [2.1.0] - 2014-11-25

### Added
- Various tablets added to mobile device detection. [#32](https://github.com/jlmakes/scrollreveal/issues/32) [#81](https://github.com/jlmakes/scrollreveal/issues/81)
- CSS Transition support is now confirmed during instantiation. [#109](https://github.com/jlmakes/scrollreveal/issues/109)

## [2.0.5] - 2014-11-23

### Changed
- Reverted `2.0.4` change to element animation logic. [#108](https://github.com/jlmakes/scrollreveal/issues/108)

## [2.0.4] - 2014-11-21

### Changed
- Revised how element animations are handled.
- Reverted `2.0.3` change to element visibility logic. [#106](https://github.com/jlmakes/scrollreveal/issues/106)

## [2.0.3] - 2014-11-14

### Added
- `data-sr` attributes are now stripped from initialized elements. [#100](https://github.com/jlmakes/scrollreveal/issues/100) @orapouso.
- Live Reload added to development environment.

### Changed
- Revised how element visibility is determined.

### Removed
- Multiple instances sharing the same viewport element no longer throw an error. [#98](https://github.com/jlmakes/scrollreveal/issues/98) @orapouso.

### Fixed
- Incomplete support for `config.delay = "onload"` was addressed.
- Issues related to `setTimeout`, `config.complete` and incorrect animation timing were addressed. [#96](https://github.com/jlmakes/scrollreveal/issues/96)

## [2.0.2] - 2014-10-23

### Added
- An error is now thrown when multiple instances share the same viewport element. [#91](https://github.com/jlmakes/scrollreveal/issues/91)

### Fixed
- Updated NPM and Bower references with new distribution path.

## [2.0.1] - 2014-10-18

### Fixed
- Incomplete support for `config.viewport` was addressed. [#67](https://github.com/jlmakes/scrollreveal/issues/67) [#68](https://github.com/jlmakes/scrollreveal/issues/68)

## [2.0.0] - 2014-10-17

### Added
- New keyword `scale`  controls element starting size.
- New option `config.complete` defines a callback for when reveals finish.
- New option `config.viewport` defines custom viewports.
- New option `config.mobile` enables/disables ScrollReveal on mobile devices.
- New option `config.delay` controls when animations are delayed.

### Changed

- **BREAKING:** ScrollReveal now uses the `data-sr` instead of `data-scroll-reveal`.
- Repository now follows [Semantic Versioning](http://semver.org/).

### Removed
- The `after` keyword was removed.

## 0.1.3 - 2014-05-26 [YANKED]

### Added
- Configuration now includes starting opacity. [#33](https://github.com/jlmakes/scrollreveal/issues/33) @kierzniak
- New `data-scroll-reveal-id` attribute added to revealed DOM elements.

### Changed
- Scroll event handling now uses `requestAnimationFrame`. [#48](https://github.com/jlmakes/scrollreveal/issues/48) @pazguille
- Generated styles are now stored in an object corresponding to the `data-scroll-reveal-id` attribute on each element. [#38](https://github.com/jlmakes/scrollreveal/pull/38) @georgelee1

## 0.1.2 - 2014-03-13 [YANKED]

### Added
- Elements with `position: fixed` are now supported. [#35](https://github.com/jlmakes/scrollreveal/issues/35)

### Fixed
- Generated styles are now more specific. [#37](https://github.com/jlmakes/scrollreveal/issues/37)

## 0.1.1 - 2014-03-06 [YANKED]

### Fixed
- Squashed bug with `enter top` and `enter left`. [#13](https://github.com/jlmakes/scrollreveal/issues/13) [#31](https://github.com/jlmakes/scrollreveal/issues/31) @sherban @danycerone

## 0.1.0 - 2014-03-05 [YANKED]

### Added
- Distribution now supports AMD/CommonJS.
- Repository now uses Gulp.
- Boilerplate Testline suite added to repository.

### Changed
- **BREAKING:** ScrollReveal now uses the `data-scroll-reveal` attribute to parse animation instructions, in place of `data-scrollReveal`.

## 0.0.4 - 2014-02-28 [YANKED]

### Fixed
- ScrollReveal no longer destroys the existing style attribute on revealed elements, but instead, now appends the necessary animation styles to existing inline styles.

## 0.0.3 - 2014-02-22 [YANKED]

### Fixed
- Removed unused CSS Transition/Transform prefixes for Mozilla and Opera.

## 0.0.2 - 2014-02-13 [YANKED]

### Added
- Constructor now accepts a configuration object to customize defaults.
- New `reset` keyword allows elements to reveal each time they enter the viewport.
- The `move` keyword can now be replaced with with CSS easing keywords (e.g. `ease-in-out`).
- Library documentation and code examples added to README.

### Changed
- ScrollReveal is no longer automatically instantiated by the `DOMContentLoaded` event.

## 0.0.1 - 2014-01-22 [YANKED]

### Hello World

[Unreleased]: https://github.com/jlmakes/scrollreveal/compare/v3.3.2...development
[3.3.2]: https://github.com/jlmakes/scrollreveal/compare/v3.3.2...v3.3.2
[3.3.2]: https://github.com/jlmakes/scrollreveal/compare/v3.3.1...v3.3.2
[3.3.1]: https://github.com/jlmakes/scrollreveal/compare/v3.3.0...v3.3.1
[3.3.0]: https://github.com/jlmakes/scrollreveal/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/jlmakes/scrollreveal/compare/v3.1.5...v3.2.0
[3.1.5]: https://github.com/jlmakes/scrollreveal/compare/v3.1.4...v3.1.5
[3.1.4]: https://github.com/jlmakes/scrollreveal/compare/v3.1.3...v3.1.4
[3.1.3]: https://github.com/jlmakes/scrollreveal/compare/v3.1.2...v3.1.3
[3.1.2]: https://github.com/jlmakes/scrollreveal/compare/v3.1.1...v3.1.2
[3.1.1]: https://github.com/jlmakes/scrollreveal/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/jlmakes/scrollreveal/compare/v3.0.9...v3.1.0
[3.0.9]: https://github.com/jlmakes/scrollreveal/compare/v3.0.8...v3.0.9
[3.0.8]: https://github.com/jlmakes/scrollreveal/compare/v3.0.7...v3.0.8
[3.0.7]: https://github.com/jlmakes/scrollreveal/compare/v3.0.6...v3.0.7
[3.0.6]: https://github.com/jlmakes/scrollreveal/compare/v3.0.5...v3.0.6
[3.0.5]: https://github.com/jlmakes/scrollreveal/compare/v3.0.4...v3.0.5
[3.0.4]: https://github.com/jlmakes/scrollreveal/compare/v3.0.3...v3.0.4
[3.0.3]: https://github.com/jlmakes/scrollreveal/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/jlmakes/scrollreveal/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/jlmakes/scrollreveal/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/jlmakes/scrollreveal/compare/v2.3.2...v3.0.0
[2.3.2]: https://github.com/jlmakes/scrollreveal/compare/v2.3.1...v2.3.2
[2.3.1]: https://github.com/jlmakes/scrollreveal/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/jlmakes/scrollreveal/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/jlmakes/scrollreveal/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/jlmakes/scrollreveal/compare/v2.0.5...v2.1.0
[2.0.5]: https://github.com/jlmakes/scrollreveal/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/jlmakes/scrollreveal/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/jlmakes/scrollreveal/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/jlmakes/scrollreveal/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/jlmakes/scrollreveal/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/jlmakes/scrollreveal/tree/v2.0.0
