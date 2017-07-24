import animate from './animate'

import { requestAnimationFrame } from '../../polyfills/requestAnimationFrame'
import { getGeometry, getScrolled, isElementVisible } from '../../utils/core'
import { each } from '../../utils/generic'


export default function delegate (event = {}) {
	requestAnimationFrame(() => {
		const containers = this.store.containers
		const elements = this.store.elements

		if (event.type === 'init' || event.type === 'resize') {
			each(containers, container => container.geometry = getGeometry.call(this, container, true))
			each(elements, element => element.geometry = getGeometry.call(this, element))
		}

		each(containers, container => container.scroll = getScrolled.call(this, container))
		each(elements, element => element.visible = isElementVisible.call(this, element))
		each(elements, element => animate.call(this, element))

		this.pristine = false
	})
}
