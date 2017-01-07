import handler from './handler'
import animate from './animate'


export default function initialize () {
	this.store.containers.forEach(container => {
		if (container === document.documentElement) {
			window.addEventListener('scroll', handler.bind(this))
			window.addEventListener('resize', handler.bind(this))
		} else {
			container.addEventListener('scroll', handler.bind(this))
			container.addEventListener('resize', handler.bind(this))
		}
	})

	this.initTimeout = null
	this.initialized = true

	animate.call(this)
}
