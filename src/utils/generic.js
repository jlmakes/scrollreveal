export function deepAssign (target, ...sources) {
	if (isObject(target)) {
		each(sources, source => {
			each(source, (data, key) => {
				if (isObject(data)) {
					if (!target[key] || !isObject(target[key])) {
						target[key] = {}
					}
					deepAssign(target[key], data)
				} else {
					target[key] = data
				}
			})
		})
		return target
	} else {
		throw new TypeError('Expected an object literal.')
	}
}

export function isObject (object) {
	return (
		object !== null &&
		typeof object === 'object' &&
		(object.constructor === Object ||
			Object.prototype.toString.call(object) === '[object Object]')
	)
}

export function each (collection, callback) {
	if (isObject(collection)) {
		const keys = Object.keys(collection)
		for (let i = 0; i < keys.length; i++) {
			callback(collection[keys[i]], keys[i], collection)
		}
	} else if (Array.isArray(collection)) {
		for (let i = 0; i < collection.length; i++) {
			callback(collection[i], i, collection)
		}
	} else {
		throw new TypeError('Expected either an array or object literal.')
	}
}

export const nextUniqueId = (() => {
	let uid = 0
	return () => uid++
})()
