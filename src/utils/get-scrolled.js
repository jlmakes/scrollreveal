export default function getScrolled (container) {
	return container.node === document.documentElement
		? {
			top: window.pageYOffset,
			left: window.pageXOffset,
		}
		: {
			top: container.node.scrollTop,
			left: container.node.scrollLeft,
		}
}
