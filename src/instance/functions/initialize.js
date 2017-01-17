import delegate from './delegate'
import { each } from '../../utils/generic'


export default function initialize () {

	let activeContainerIds = []
	each(this.store.elements, element => {
		if (activeContainerIds.indexOf(element.containerId) === -1) {
			activeContainerIds.push(element.containerId)
		}
	})

	each(this.store.containers, (container, id, containers) => {

		let containerId = parseInt(id)
		if (activeContainerIds.indexOf(containerId) === -1) {
			container.node.removeEventListener('scroll', delegate)
			container.node.removeEventListener('resize', delegate)
			delete containers[id]

		} else if (container.node === document.documentElement) {
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
