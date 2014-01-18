#scrollReveal.js
####Declarative CSS3 transitions on scroll.
A simple way to create and maintain how elements fade in, triggered when they enter the viewport. An open-source experiment by [@JulianLloyd](https://twitter.com/julianlloyd)

> **Disclaimer:** This is a brand new project and still under active development. Please bare in mind that this plug-in will be updated frequently, and that breaking changes are virtually guaranteed in the next couple iterations.

##1. Installation
Please download `scrollReveal.js` into your JavaScript folder, and reference it just before the closing `</body>` tag. It will automatically instantiate itself ready-to-go when the event `DOMContentReady` fires.


```
    // Everything else
    // ...

    <script src="js/scrollReveal.js"></script>
</body>
```

>**NOTE:** scrollReveal.js does not require jQuery, but *does* rely upon CSS3 transitions; it has been developed exclusively for modern browser use only.


##2. Usage
By adding a `data-scrollreveal` attribute to an element, it will automatically be revealed (using default values) as soon as the element is within the viewport.<br><br> **Fig 1**:

```
<h1 data-scrollreveal>Welcome Traveler</h1>
```
However, scrollReveal.js allows you to describe custom reveal behavior, using *natural language*. <br><br>**Fig 2**:
```
<h1 data-scrollreveal="enter from the top and move 50px over 1.1s"> Welcome </h1>
<p data-scrollreveal="move 66px and enter from the bottom after 1.s"> Hello </p>
<button data-scrollreveal="enter from the bottom over 1.1s but wait 2.5s"> Signup </button>
```



###2.1 Keywords, Values and Fillers
Whatever string is passed to the `data-scrollreveal` attribute is parsed for specific words: **keywords** that expect to be followed by a **value**, and semantic **fillers** that facilitate the use of more natural language.

####2.1.1 Keywords and Values
These words describe the reveal behavior, using **keyword** / **value** pairs.

---

- **Enter** — Controls the direction of your element transition. Whatever value is passed is considered the vector origin. For example, specifying `top` will reveal your element with a downward motion.
  * Accepted value: `top`, `right`, `bottom` or `left`

---

- **Move** — The distance your element will travel during transition.
 * Accepted value: **[ integer ] px** →(eg. `move 33px`)

---

- **Over** — The duration of your element’s transition.
 * Accepted value: **[ decminal ] s** → (eg. `over 1.66s`)

---

- **After/Wait** — The delay before your element beings its transition.
 * Accepted value: **[ decminal ] s** → (eg. `after 0.33s` or `wait 0.33s`)

---

#### 2.1.2 Fillers
While **keywords** must be followed by an appropriate accepted **value**, the use of conjoining **fillers** are permitted for more natural language. These are shown below:

- `from`
- `the`
- `and`
- `then`
- `but`

**Fig 3**:
```
<!-- These are equivalent -->
<div data-scrollreveal="enter top move 25px"> Example 1 </div>
<div data-scrollreveal="enter from the top and then move 25px"> Example 1 </div>

<!-- These too are equivalent -->
<div data-scrollreveal="move 80px over 0.66s but then wait 3s"> Example 2 </div>
<div data-scrollreveal="over 0.66s move 80px wait 3s"> Example 2 </div>
```

### 3. Contributions / Thanks!
I noticed a number of clients requesting CSS3 transitions on scroll for various site elements, so I created this little vanilla JavaScript helper plug-in to help out.

Many thanks to Codrops, Mary Lou and the [cbpScroller.js](http://tympanus.net/codrops/2013/07/18/on-scroll-effect-layout/), © 2014, Codrops.

#####**If you’d like to contribute, please feel free!**

© 2014 [@JulianLloyd](https://twitter.com/julianlloyd)<br>
Licensed under the MIT license.
[http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)
