#scrollReveal.js
####Declarative on-scroll reveal animations.
A simple way to create and maintain how elements fade in, triggered when they enter the viewport. An open-source experiment by [@JulianLloyd](https://twitter.com/julianlloyd)
***
##[See Demo](http://julianlloyd.me/scrollreveal)
> **Disclaimer:** Please bear in mind that this plug-in is an experimental stage, and that breaking changes are virtually guaranteed in future updates.

##1. Installation
Clone or download `scrollReveal.js` into your JavaScript folder, and reference it just before the closing `</body>` tag. It will automatically instantiate ready-to-go when the `DOMContentReady` event fires.


```html
    // Everything else
    // ...

    <script src="js/scrollReveal.js"></script>
</body>
```

>**NOTE:** scrollReveal.js does not require jQuery, but *does* rely upon CSS3 transitions; as such, it has been developed exclusively for modern browser use only.


##2. Usage
By adding a `data-scrollreveal` attribute to an element, it will automatically be revealed (using default values) as soon as the element is within the viewport.<br><br> **Fig 1**:

```html
<p data-scrollreveal> Hello world! </p>
```
However, scrollReveal.js allows you to define custom reveals, using *descriptive language*. <br><br>**Fig 2**:
```html
<p data-scrollreveal="enter left and move 50px over 1.33s"> Foo </p>
<p data-scrollreveal="move 66px and enter from the bottom after 1s"> Bar </p>
<p data-scrollreveal="enter from the top over 1.1s but wait 2.5s"> Baz </p>
```



###2.1 Keywords, Values and Fillers
Whatever string is passed to the `data-scrollreveal` attribute is parsed for specific words: **keywords** that expect to be followed by a **value**, and semantic **fillers** that facilitate more natural language.

####2.1.1 Keywords and Values
These words describe the reveal behavior, using **keyword** / **value** pairs.

---

- **Enter** — Controls the direction of your element transition. Whatever value is passed is considered the vector origin. For example, specifying `top` will reveal your element with a downward motion.

  * Accepted values: `top`, `right`, `bottom` or `left`
  * Example: `enter top`

---

- **Move** — The distance your element will travel during transition.

 * Accepted value: **[ integer ] px**
 * Example: `move 33px`

---

- **Over** — The duration of your element’s transition.

 * Accepted value: **[ decimal ] s**
 * Example: `over 1.66s`

---

- **After/Wait** — The delay before your element begins its transition.

 * Accepted value: **[ decimal ] s**
 * Example: `after 0.33s` or `wait 0.33s`

---

#### 2.1.2 Fillers
While **keywords** must be followed by an appropriate accepted **value**, the use of conjoining **fillers** are permitted for more readable language. These are shown below:

- `from`
- `the`
- `and`
- `then`
- `but`

**Fig 3**:
```html
<!-- Eg. 3.1 — These 2 lines are equivalent -->
<p data-scrollreveal="enter top move 25px"> foo </p>
<p data-scrollreveal="enter from the top and then move 25px"> foo </p>

<!-- Eg. 3.2 — These 3 lines are equivalent -->
<p data-scrollreveal="enter left move 80px over 0.66s but then wait 3s"> bar </p>
<p data-scrollreveal="over 0.66s move 80px but wait 3s and enter from the left"> bar </p>
<p data-scrollreveal="after 3s, enter left and move 80px over 0.66s"> bar </p>
```

### 3. Contributions
There are already some great ideas under development (see [open issues](https://github.com/julianlloyd/scrollReveal.js/issues?state=open)); if you’d like to contribute, please do!

Many thanks to [@Codrops](https://twitter.com/codrops), [@Mary Lou](https://twitter.com/crnacura) and the [cbpScroller.js](http://tympanus.net/codrops/2013/07/18/on-scroll-effect-layout/), © 2014, [Codrops](http://tympanus.net/codrops/).

### 4. License

Licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)

Copyright 2014 [@JulianLloyd](https://twitter.com/julianlloyd)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
