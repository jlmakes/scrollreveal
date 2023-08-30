export default function getScrolled(container) {
	let top, left
	if (typeof document !=='undefined' &&container.node === document.documentElement) {
		top = window.pageYOffset
		left = window.pageXOffset
	} else {
		top = container.node.scrollTop
		left = container.node.scrollLeft
	}
	return { top, left }
}
