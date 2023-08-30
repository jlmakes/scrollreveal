export default function isTransformSupported() {
	const style = typeof document !=='undefined'?document.documentElement.style:{}
	return 'transform' in style || 'WebkitTransform' in style
}
