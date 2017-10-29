import clean from '../methods/clean'

export default function animate (element, force = {}) {
	const pristine = force.pristine || this.pristine
	const delayed =
		element.config.useDelay === 'always' ||
		(element.config.useDelay === 'onload' && pristine) ||
		(element.config.useDelay === 'once' && !element.seen)

	const shouldReveal = element.visible && !element.revealed
	const shouldReset = !element.visible && element.revealed && element.config.reset

	if (shouldReveal || force.reveal) {
		return triggerReveal.call(this, element, delayed)
	}

	if (shouldReset || force.reset) {
		return triggerReset.call(this, element)
	}
}

function triggerReveal (element, delayed) {
	const styles = [
		element.styles.inline.generated,
		element.styles.opacity.computed,
		element.styles.transform.generated.final,
	]
	if (delayed) {
		styles.push(element.styles.transition.generated.delayed)
	} else {
		styles.push(element.styles.transition.generated.instant)
	}
	element.revealed = element.seen = true
	element.node.setAttribute('style', styles.filter(s => s !== '').join(' '))
	registerCallbacks.call(this, element, delayed)
}

function triggerReset (element) {
	const styles = [
		element.styles.inline.generated,
		element.styles.opacity.generated,
		element.styles.transform.generated.initial,
		element.styles.transition.generated.instant,
	]
	element.revealed = false
	element.node.setAttribute('style', styles.filter(s => s !== '').join(' '))
	registerCallbacks.call(this, element)
}

function registerCallbacks (element, isDelayed) {
	const duration = isDelayed
		? element.config.duration + element.config.delay
		: element.config.duration

	const beforeCallback = element.revealed
		? element.config.beforeReveal
		: element.config.beforeReset

	const afterCallback = element.revealed ? element.config.afterReveal : element.config.afterReset

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
