import animate from './animate'

import { requestAnimationFrame } from '../../polyfills/requestAnimationFrame'
import { getGeometry, getScrolled } from '../../utils/core'
import { each } from '../../utils/generic'


export default function delegate (event = {}) {
	requestAnimationFrame(() => {
		const containers = this.store.containers
		const elements = this.store.elements

		switch (event.type) {

			case 'scroll':
				each(containers, container => container.scroll = getScrolled.call(this, container))
				each(elements, element => animate.call(this, element))
				break

			case 'resize':
			default:
				each(containers, container => {
					container.geometry = getGeometry.call(this, container, /* isContainer: */ true)
					container.scroll = getScrolled.call(this, container)
				})
				each(elements, element => {
					element.geometry = getGeometry.call(this, element)
					animate.call(this, element)
				})
		}
	})
}
