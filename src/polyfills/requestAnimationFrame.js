export const polyfill = (() => {
	let clock = Date.now()

	return (callback) => {
		const currentTime = Date.now()
		if (currentTime - clock > 16) {
			clock = currentTime
			callback(currentTime)
		} else {
			setTimeout(() => polyfill(callback), 0)
		}
	}
})()


export const requestAnimationFrame = window.requestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| polyfill
