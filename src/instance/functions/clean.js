import { each } from '../../utils/generic'
import { getNodes } from '../../utils/core'
import rinse from './rinse'

export default function clean (target) {

	let dirty

	each(getNodes(target), node => {
		const id = node.getAttribute('data-sr-id')
		if (id !== null) {
			dirty = true
			node.setAttribute('style', this.store.elements[id].styles.inline)
			node.removeAttribute('data-sr-id')
			delete this.store.elements[id]
		}
	})

	if (dirty) rinse.call(this)
}
