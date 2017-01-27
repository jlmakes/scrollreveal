import { isElementVisible } from '../../utils/core'


export default function animate (element) {

	const isDelayed = element.config.useDelay === 'always'
		|| element.config.useDelay === 'onload' && this.pristine
		|| element.config.useDelay === 'once' && !element.seen

	let styles = [element.styles.inline]

	if (isElementVisible.call(this, element) && !element.visible) {

		styles.push(element.styles.opacity.computed)
		styles.push(element.styles.transform.generated.final)

		if (isDelayed) {
			styles.push(element.styles.transition.generated.delayed)
		} else {
			styles.push(element.styles.transition.generated.instant)
		}

		element.seen = true
		element.visible = true
		registerCallbacks(element, isDelayed)
		element.node.setAttribute('style', styles.join(' '))

	} else if (!isElementVisible.call(this, element) && element.visible) {

		styles.push(element.styles.opacity.generated)
		styles.push(element.styles.transform.generated.initial)
		styles.push(element.styles.transition.generated.instant)

		element.visible = false
		registerCallbacks(element)
		element.node.setAttribute('style', styles.join(' '))
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
		}, duration - elapsed),
	}
}
