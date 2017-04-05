import { isElementVisible } from '../../utils/core'
import clean from '../methods/clean'


export default function animate (element) {

	const isDelayed = element.config.useDelay === 'always'
		|| element.config.useDelay === 'onload' && this.pristine
		|| element.config.useDelay === 'once' && !element.seen

	const sequence = (element.sequence) ? this.store.sequences[element.sequence.id] : null
	const styles = [element.styles.inline]

	if (isElementVisible.call(this, element) && !element.visible) {

		if (sequence !== null) {
			if (sequence.head.index === null && sequence.tail.index === null) {
				sequence.head.index = sequence.tail.index = element.sequence.index
				sequence.head.blocked = sequence.tail.blocked = true

			} else if (sequence.head.index - 1 === element.sequence.index && !sequence.head.blocked) {
				sequence.head.index--
				sequence.head.blocked = true

			} else if (sequence.tail.index + 1 === element.sequence.index && !sequence.tail.blocked) {
				sequence.tail.index++
				sequence.tail.blocked = true

			} else return

			window.setTimeout(() => {
				sequence.head.blocked = sequence.tail.blocked = false
				this.delegate()
			}, sequence.interval)
		}

		styles.push(element.styles.opacity.computed)
		styles.push(element.styles.transform.generated.final)

		if (isDelayed) {
			styles.push(element.styles.transition.generated.delayed)
		} else {
			styles.push(element.styles.transition.generated.instant)
		}

		element.seen = true
		element.visible = true
		registerCallbacks.call(this, element, isDelayed)
		element.node.setAttribute('style', styles.join(' '))

	} else {
		if (!isElementVisible.call(this, element) && element.visible && element.config.reset) {

			if (sequence) {
				if (sequence.head.index === element.sequence.index) {
					sequence.head.index++
				} else if (sequence.tail.index === element.sequence.index) {
					sequence.tail.index--
				} else return
			}

			styles.push(element.styles.opacity.generated)
			styles.push(element.styles.transform.generated.initial)
			styles.push(element.styles.transition.generated.instant)

			element.visible = false
			registerCallbacks.call(this, element)
			element.node.setAttribute('style', styles.join(' '))
		}
	}
}


function registerCallbacks (element, isDelayed) {

	const duration = (isDelayed)
		? element.config.duration + element.config.delay
		: element.config.duration

	let afterCallback
	if (element.visible) {
		element.config.beforeReveal(element.node)
		afterCallback = element.config.afterReveal
	} else {
		element.config.beforeReset(element.node)
		afterCallback = element.config.afterReset
	}

	let elapsed = 0
	if (element.callbackTimer) {
		elapsed = Date.now() - element.callbackTimer.start
		window.clearTimeout(element.callbackTimer.clock)
	}

	element.callbackTimer = {
		start: Date.now(),
		clock: window.setTimeout(() => {
			afterCallback(element.node)
			element.callbackTimer = null
			if (element.visible && !element.config.reset) {
				clean.call(this, element.node)
			}
		}, duration - elapsed),
	}
}
