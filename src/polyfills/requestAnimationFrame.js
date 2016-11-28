export const polyfill = (() => {
	let clock = Date.now();

	return (callback) => {

		const currentTime = Date.now();
		const deltaTime = currentTime - clock;
		clock += deltaTime;

		if (deltaTime > 16) {
			callback(currentTime);
		}
	};
})();

export const requestAnimationFrame = window.requestAnimationFrame ||
																		 window.webkitRequestAnimationFrame ||
																		 window.mozRequestAnimationFrame ||
																		 polyfill;
