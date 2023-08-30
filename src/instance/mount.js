function failure() {
	typeof document !=='undefined'&&document.documentElement.classList.remove('sr')

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
	typeof document !=='undefined'?document.documentElement.classList.add('sr'):'';

	if (typeof document !=='undefined'&&document.body) {
		document.body.style.height = '100%';
	} else {
		typeof document !=='undefined' && document.addEventListener('DOMContentLoaded', function () {
			document.body.style.height = '100%';
		});
	}
}

export default { success, failure }
