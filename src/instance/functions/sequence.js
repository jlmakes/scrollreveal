import animate from './animate'
import each from '../../utils/each'
import nextUniqueId from '../../utils/next-unique-id'

export default function sequence(element, pristine = this.pristine) {
	/**
	 * We first check if the element should reset.
	 */
	if (!element.visible && element.revealed && element.config.reset) {
		return animate.call(this, element, { reset: true })
	}

	const store = this.store
	const seq = store.sequences[element.sequence.id]
	const i = element.sequence.index

	if (seq) {
		const visible = new SequenceModel(seq, 'visible', store)
		const revealed = new SequenceModel(seq, 'revealed', store)

		seq.models = { visible, revealed }

		/**
		 * At any given time, the sequencer
		 * needs to find these 3 elements:
		 */
		let currentElement
		let nextHeadElement
		let nextFootElement

		/**
		 * When no elements within a sequence are revealed,
		 * these 3 elements are easily pulled from the
		 * current visible sequence model.
		 */
		if (!revealed.body.length) {
			currentElement = getElement(seq, visible.body.shift(), store)
			nextHeadElement = getElement(seq, visible.head.pop(), store)
			nextFootElement = getElement(seq, visible.body.shift(), store)
		} else {
			/**
			 * More typically though, something will be revealed
			 * and we need to model the unrevealed elements.
			 */
			const unrevealed = {
				head: visible.body.filter(x => revealed.head.indexOf(x) >= 0),
				foot: visible.body.filter(x => revealed.foot.indexOf(x) >= 0)
			}
			/**
			 * Now we can compare the current sequence index
			 * against our new model to determine the current element.
			 */
			if (!seq.blocked.head && i === [...unrevealed.head].pop()) {
				currentElement = getElement(seq, unrevealed.head.pop(), store)
			} else if (!seq.blocked.foot && i === [...unrevealed.foot].shift()) {
				currentElement = getElement(seq, unrevealed.foot.shift(), store)
			}
			/**
			 * And the next head and foot elements are
			 * easily pulled from our custom unrevealed model.
			 */
			nextHeadElement = getElement(seq, unrevealed.head.pop(), store)
			nextFootElement = getElement(seq, unrevealed.foot.shift(), store)
		}

		/**
		 * Verify and animate!
		 */
		if (currentElement) {
			if (nextHeadElement) cue.call(this, seq, nextHeadElement, 'head', pristine)
			if (nextFootElement) cue.call(this, seq, nextFootElement, 'foot', pristine)
			return animate.call(this, currentElement, { reveal: true, pristine })
		}
	}
}

export function Sequence(interval) {
	this.id = nextUniqueId()
	this.interval = interval
	this.members = []
	this.models = {}
	this.blocked = {
		head: false,
		foot: false
	}
}

function SequenceModel(seq, prop, store) {
	this.head = [] // Elements before the body with a falsey prop.
	this.body = [] // Elements with a truthy prop.
	this.foot = [] // Elements after the body with a falsey prop.

	each(seq.members, (id, index) => {
		const element = store.elements[id]
		if (element && element[prop]) {
			this.body.push(index)
		}
	})

	if (this.body.length) {
		each(seq.members, (id, index) => {
			const element = store.elements[id]
			if (element && !element[prop]) {
				if (index < this.body[0]) {
					this.head.push(index)
				} else {
					this.foot.push(index)
				}
			}
		})
	}
}

function cue(seq, element, direction, pristine) {
	seq.blocked[direction] = true
	setTimeout(() => {
		seq.blocked[direction] = false
		sequence.call(this, element, pristine)
	}, seq.interval)
}

function getElement(seq, index, store) {
	const id = seq.members[index]
	return store.elements[id]
}
