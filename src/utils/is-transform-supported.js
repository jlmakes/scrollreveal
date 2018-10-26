export default function isTransformSupported() {
	const style = document.documentElement.style
	return 'transform' in style || 'WebkitTransform' in style
}
