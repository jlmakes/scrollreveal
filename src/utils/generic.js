export function isObject (object) {
	return object !== null && typeof object === 'object' &&
		(object.constructor === Object || Object.prototype.toString.call(object) === '[object Object]');
}

export function forOwn (object, callback) {
	if (!isObject(object)) {
		logger(`Expected "object", but received "${typeof object}".`);
	} else {
		for (const property in object) {
			if (object.hasOwnProperty(property)) {
				callback(property);
			}
		}
	}
}

export function logger (message) {
	if (console) {
		console.log(`ScrollReveal: ${message}`); // eslint-disable-line no-console
	}
}

export const nextUniqueId = (() => {
	let uid = 0;
	return () => uid++;
})();
