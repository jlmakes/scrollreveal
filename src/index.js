import ScrollReveal from './instance/constructor'


if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
	define(() => ScrollReveal)
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = ScrollReveal
} else {
	window.ScrollReveal = ScrollReveal
}
