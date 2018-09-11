function failure() {
	document.documentElement.classList.remove('sr')

	return {
		clean() {},
		destroy() {},
		reveal() {},
		sync() {},
		get noop() {
			return true
		}
	}
}

function success() {
	document.documentElement.classList.add('sr')

	if (document.body) {
		document.body.style.height = '100%'
	} else {
		document.addEventListener('DOMContentLoaded', () => {
			document.body.style.height = '100%'
		})
	}
}

export default { success, failure }
