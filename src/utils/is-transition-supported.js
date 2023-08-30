export default function isTransitionSupported() {
	const style =typeof document !=='undefined'? document.documentElement.style:{}
	return 'transition' in style || 'WebkitTransition' in style
}
