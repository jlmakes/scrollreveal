export function deepAssign (target, ...sources) {
	sources.forEach((source) => {
		forOwn(source, (property) => {
			if (isObject(source[property])) {
				if (!target[property] || !isObject(target[property])) {
					target[property] = {};
				}
				deepAssign(target[property], source[property]);
			} else {
				target[property] = source[property];
			}
		});
	});
	return target;
}


export function isObject (object) {
	return object !== null && typeof object === 'object' &&
		(object.constructor === Object || Object.prototype.toString.call(object) === '[object Object]');
}


export function forOwn (object, callback) {
	if (isObject(object)) {
		for (const property in object) {
			if (object.hasOwnProperty(property)) {
				callback(property);
			}
		}
	} else {
		throw new TypeError('Expected an object literal.');
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
