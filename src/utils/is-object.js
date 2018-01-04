export default function isObject (x) {
	return (
		x !== null &&
		x instanceof Object &&
		(x.constructor === Object || Object.prototype.toString.call(x) === '[object Object]')
	)
}
