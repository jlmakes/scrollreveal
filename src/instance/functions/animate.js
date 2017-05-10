import { isElementVisible } from '../../utils/core'
import { each } from '../../utils/generic'
import clean from '../methods/clean'


export default function animate (element) {

	const isVisible = isElementVisible.call(this, element)
	const isDelayed = element.config.useDelay === 'always'
		|| element.config.useDelay === 'onload' && this.pristine
		|| element.config.useDelay === 'once' && !element.seen

	const sequence = this.store.sequences[element.sequence.id]

	if (isVisible && !element.visible) {
		element.visible = element.seen = true
		if (sequence) {
			updateSequenceIndexes.call(this, sequence)
		}
		return triggerReveal.call(this, element, isDelayed)
	}

	if (!isVisible && element.visible && element.config.reset) {
		element.visible = false
		if (sequence) {
			updateSequenceIndexes.call(this, sequence)
		}
		return triggerReset.call(this, element)
	}
}


function triggerReveal (element, isDelayed) {
	const styles = [
		element.styles.inline,
		element.styles.opacity.computed,
		element.styles.transform.generated.final,
	]
	isDelayed
		? styles.push(element.styles.transition.generated.delayed)
		: styles.push(element.styles.transition.generated.instant)
	registerCallbacks.call(this, element, isDelayed)
	element.node.setAttribute('style', styles.filter(i => i !== '').join(' '))
}


function triggerReset (element) {
	const styles = [
		element.styles.inline,
		element.styles.opacity.generated,
		element.styles.transform.generated.initial,
		element.styles.transition.generated.instant,
	]
	registerCallbacks.call(this, element)
	element.node.setAttribute('style', styles.filter(i => i !== '').join(' '))
}


function registerCallbacks (element, isDelayed) {
	const duration = isDelayed
		? element.config.duration + element.config.delay
		: element.config.duration

	const beforeCallback = element.visible
		? element.config.beforeReveal
		: element.config.beforeReset

	const afterCallback = element.visible
		? element.config.afterReveal
		: element.config.afterReset

	let elapsed = 0
	if (element.callbackTimer) {
		elapsed = Date.now() - element.callbackTimer.start
		window.clearTimeout(element.callbackTimer.clock)
	}

	beforeCallback(element.node)

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


function updateSequenceIndexes (sequence) {
	let min = Infinity
	let max = -Infinity
	each(sequence.elementIds, id => {
		const element = this.store.elements[id]
		if (element.visible) {
			min = Math.min(min, element.sequence.index)
			max = Math.max(max, element.sequence.index)
		}
	})
	sequence.nose.index = min
	sequence.tail.index = max
}
