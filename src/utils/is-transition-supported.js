export default function isTransitionSupported() {
	const style = document.documentElement.style
	return 'transition' in style || 'WebkitTransition' in style
}
