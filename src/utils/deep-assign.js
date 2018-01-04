import isObject from './is-object'
import each from './each'

export default function deepAssign(target, ...sources) {
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
		throw new TypeError('Target must be an object literal.')
	}
}
