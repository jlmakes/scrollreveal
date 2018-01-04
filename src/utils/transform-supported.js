export default function transformSupported() {
	const style = document.documentElement.style
	return 'transform' in style || 'WebkitTransform' in style
}
