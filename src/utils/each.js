import isObject from './is-object'

export default function each (collection, callback) {
	if (isObject(collection)) {
		const keys = Object.keys(collection)
		return keys.forEach(key => callback(collection[key], key, collection))
	}
	if (collection instanceof Array) {
		return collection.forEach((item, i) => callback(item, i, collection))
	}
	throw new TypeError('Expected either an array or object literal.')
}
