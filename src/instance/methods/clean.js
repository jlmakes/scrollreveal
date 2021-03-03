import $ from 'tealight'
import each from '../../utils/each'
import logger from '../../utils/logger'
import rinse from '../functions/rinse'
import { applyStyle } from '../functions/style'

export default function clean(target) {
	let dirty
	try {
		each($(target), node => {
			const id = node.getAttribute('data-sr-id')
			if (id !== null) {
				dirty = true
				const element = this.store.elements[id]
				if (element.callbackTimer) {
					window.clearTimeout(element.callbackTimer.clock)
				}
				applyStyle(element.node, element.styles.inline.generated)
				node.removeAttribute('data-sr-id')
				delete this.store.elements[id]
			}
		})
	} catch (e) {
		return logger.call(this, 'Clean failed.', e.message)
	}

	if (dirty) {
		try {
			rinse.call(this)
		} catch (e) {
			return logger.call(this, 'Clean failed.', e.message)
		}
	}
}
