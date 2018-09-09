function failure() {
	const root = document.documentElement

	root.classList.remove('sr')

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
	const html = document.documentElement
	const body = document.body

	html.classList.add('sr')

	if (body) {
		body.style.height = '100%'
	} else {
		document.addEventListener('DOMContentLoaded', () => {
			body.style.height = '100%'
		})
	}
}

export default { success, failure }
