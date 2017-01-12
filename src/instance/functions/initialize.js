import delegate from './delegate'
import { each } from '../../utils/generic'


export default function initialize () {
	each(this.store.containers, container => {
		if (container.node === document.documentElement) {
			window.addEventListener('scroll', delegate.bind(this))
			window.addEventListener('resize', delegate.bind(this))
		} else {
			container.node.addEventListener('scroll', delegate.bind(this))
			container.node.addEventListener('resize', delegate.bind(this))
		}
	})

	this.initTimeout = null
	this.initialized = true

	delegate.call(this)
}
