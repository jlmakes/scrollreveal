export function deepAssign (target, ...sources) {
	if (isObject(target)) {
		sources.forEach(source => {
			forOwn(source, property => {
				if (isObject(source[property])) {
					if (!target[property] || !isObject(target[property])) {
						target[property] = {}
					}
					deepAssign(target[property], source[property])
				} else {
					target[property] = source[property]
				}
			})
		})
		return target
	} else {
		throw new TypeError('Expected an object literal.')
	}
}


export function deepEqual (first, second) {
	if (isObject(first)) {
		let bool = true
		forOwn(second, property => {
			if (bool) {
				if (isObject(second[property]))
					return bool = deepEqual(first[property], second[property])
				if (first[property] !== second[property])
					return bool = false
			}
		})
		return bool
	} else {
		throw new TypeError('Expected an object literal.')
	}
}


export function isObject (object) {
	return object !== null && typeof object === 'object'
		&& (object.constructor === Object || Object.prototype.toString.call(object) === '[object Object]')
}


export function forOwn (object, callback) {
	if (isObject(object)) {
		for (const property in object) {
			if (object.hasOwnProperty(property)) callback(property)
		}
	} else {
		throw new TypeError('Expected an object literal.')
	}
}


export const nextUniqueId = (() => {
	let uid = 0
	return () => uid++
})()
