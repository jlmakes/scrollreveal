import handler from './handler'
import { each } from '../../utils/generic'


export default function initialize () {
	each(this.store.containers, container => {
		if (container.node === document.documentElement) {
			window.addEventListener('scroll', handler.bind(this))
			window.addEventListener('resize', handler.bind(this))
		} else {
			container.node.addEventListener('scroll', handler.bind(this))
			container.node.addEventListener('resize', handler.bind(this))
		}
	})

	this.initTimeout = null
	this.initialized = true

	handler.call(this)
}
