export const polyfill = (() => {
	let clock = Date.now();
	let deltaTime;

	return (callback) => {

		const currentTime = Date.now();
		deltaTime = currentTime - clock;

		if (deltaTime > 16) {
			clock += deltaTime;
			callback(currentTime);
		} else {
			setTimeout(() => {
				polyfill(callback);
			}, 0);
		}
	};
})();


export const requestAnimationFrame = window.requestAnimationFrame       ||
                                     window.webkitRequestAnimationFrame ||
                                     window.mozRequestAnimationFrame    ||
                                     polyfill;
