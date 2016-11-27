export function logger (message) {
	if (console) {
		console.log(`ScrollReveal: ${message}`); // eslint-disable-line no-console
	}
}

/**
* Sequential number generator for unique IDs.
* @return {number}
*/
export const nextUniqueId = (() => {
	let uid = 0;
	return () => uid++;
})();
