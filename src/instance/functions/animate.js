import clean from '../methods/clean'


export default function animate (element, charge) {
	const delayed = element.config.useDelay === 'always'
		|| element.config.useDelay === 'onload' && this.pristine
		|| element.config.useDelay === 'once' && !element.seen

	const shouldReveal = element.visible && !element.revealed
	const shouldReset = !element.visible && element.revealed && element.config.reset

	if (shouldReveal && !charge || charge === +1) {
		return triggerReveal.call(this, element, delayed)
	}

	if (shouldReset && !charge || charge === -1) {
		return triggerReset.call(this, element)
	}
}


function triggerReveal (element, delayed) {
	const styles = [
		element.styles.inline,
		element.styles.opacity.computed,
		element.styles.transform.generated.final,
	]
	delayed
		? styles.push(element.styles.transition.generated.delayed)
		: styles.push(element.styles.transition.generated.instant)
	element.revealed = element.seen = true
	element.node.setAttribute('style', styles.filter(i => i !== '').join(' '))
	registerCallbacks.call(this, element, delayed)
}


function triggerReset (element) {
	const styles = [
		element.styles.inline,
		element.styles.opacity.generated,
		element.styles.transform.generated.initial,
		element.styles.transition.generated.instant,
	]
	element.revealed = false
	element.node.setAttribute('style', styles.filter(i => i !== '').join(' '))
	registerCallbacks.call(this, element)
}


function registerCallbacks (element, isDelayed) {
	const duration = isDelayed
		? element.config.duration + element.config.delay
		: element.config.duration

	const beforeCallback = element.revealed
		? element.config.beforeReveal
		: element.config.beforeReset

	const afterCallback = element.revealed
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
			if (element.revealed && !element.config.reset) {
				clean.call(this, element.node)
			}
		}, duration - elapsed),
	}
}
