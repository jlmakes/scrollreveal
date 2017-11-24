import { each, getNodes } from 'tealight'
import { logger } from '../../utils/core'
import rinse from '../functions/rinse'

export default function clean (target) {
	let dirty
	try {
		each(getNodes(target), node => {
			const id = node.getAttribute('data-sr-id')
			if (id !== null) {
				dirty = true
				const element = this.store.elements[id]
				if (element.callbackTimer) {
					window.clearTimeout(element.callbackTimer.clock)
				}
				node.setAttribute('style', element.styles.inline.generated)
				node.removeAttribute('data-sr-id')
				delete this.store.elements[id]
			}
		})
	} catch (e) {
		return logger.call(this, 'Clean failed.', e.stack || e.message)
	}

	if (dirty) {
		try {
			rinse.call(this)
		} catch (e) {
			return logger.call(this, 'Clean failed.', e.stack || e.message)
		}
	}
}
