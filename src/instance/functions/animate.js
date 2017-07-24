import { each } from '../../utils/generic'
import clean from '../methods/clean'


export default function animate (element, sequencing) {

	const sequence = (element.sequence) ? this.store.sequences[element.sequence.id] : false
	const delayed = element.config.useDelay === 'always'
		|| element.config.useDelay === 'onload' && this.pristine
		|| element.config.useDelay === 'once' && !element.seen

	if (sequencing) {
		if (element.sequence.index === sequence.nose.pointer - 1 && sequence.nose.pointer > sequence.nose.index) {
			sequence.nose.pointer--
			queueSequenceNose.call(this, sequence)
		} else if (element.sequence.index === sequence.tail.pointer + 1 && sequence.tail.pointer < sequence.tail.index) {
			sequence.tail.pointer++
			queueSequenceTail.call(this, sequence)
		} else {
			return
		}
		return triggerReveal.call(this, element, delayed)
	}

	if (element.visible && !element.revealed) {
		if (sequence) {
			updateSequenceIndexes.call(this, sequence)
			if (sequence.nose.pointer === null && sequence.tail.pointer === null) {
				sequence.nose.pointer = sequence.tail.pointer = element.sequence.index
				queueSequenceNose.call(this, sequence)
				queueSequenceTail.call(this, sequence)
			} else if (element.sequence.index === sequence.nose.pointer - 1 && !sequence.nose.blocked) {
				sequence.nose.pointer--
				queueSequenceNose.call(this, sequence)
			} else if (element.sequence.index === sequence.tail.pointer + 1 && !sequence.tail.blocked) {
				sequence.tail.pointer++
				queueSequenceTail.call(this, sequence)
			} else {
				return
			}
		}
		return triggerReveal.call(this, element, delayed)
	}

	if (!element.visible && element.revealed && element.config.reset) {
		if (sequence) {
			updateSequenceIndexes.call(this, sequence)
			if (sequence.nose.index !== Infinity && sequence.tail.index !== -Infinity) {
				sequence.nose.pointer = Math.max(sequence.nose.pointer, sequence.nose.index)
				sequence.tail.pointer = Math.min(sequence.tail.pointer, sequence.tail.index)
			}
		}
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


function updateSequenceIndexes (sequence) {
	let min = Infinity
	let max = -Infinity
	each(sequence.elementIds, id => {
		const element = this.store.elements[id]
		if (element && element.visible) {
			min = Math.min(min, element.sequence.index)
			max = Math.max(max, element.sequence.index)
		}
	})
	sequence.nose.index = min
	sequence.tail.index = max
}


function queueSequenceNose (sequence) {
	const nextId = sequence.elementIds[sequence.nose.pointer - 1]
	const nextElement = this.store.elements[nextId]
	if (nextElement) {
		sequence.nose.blocked = true
		window.setTimeout(() => {
			sequence.nose.blocked = false
			animate.call(this, nextElement, true)
		}, sequence.interval)
	}
}


function queueSequenceTail (sequence) {
	const nextId = sequence.elementIds[sequence.tail.pointer + 1]
	const nextElement = this.store.elements[nextId]
	if (nextElement) {
		sequence.tail.blocked = true
		window.setTimeout(() => {
			sequence.tail.blocked = false
			animate.call(this, nextElement, true)
		}, sequence.interval)
	}
}
