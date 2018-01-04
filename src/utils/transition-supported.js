export default function transitionSupported() {
	const style = document.documentElement.style
	return 'transition' in style || 'WebkitTransition' in style
}
