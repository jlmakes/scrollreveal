import animate from './animate'
import { each, nextUniqueId } from '../../utils/generic'

export default function sequence (element, pristine = this.pristine) {
	const seq = this.store.sequences[element.sequence.id]
	const i = element.sequence.index

	if (seq) {
		const visible = new SequenceModel('visible', seq, this.store)
		const revealed = new SequenceModel('revealed', seq, this.store)

		seq.models = { visible, revealed }

		/**
		 * If the sequence has no revealed members,
		 * then we reveal the first visible element
		 * within that sequence.
		 *
		 * The sequence then cues a recursive call
		 * in both directions.
		 */
		if (!revealed.body.length) {
			const nextId = seq.members[visible.body[0]]
			const nextElement = this.store.elements[nextId]

			if (nextElement) {
				cue.call(this, seq, visible.body[0], -1, pristine)
				cue.call(this, seq, visible.body[0], +1, pristine)

				seq.lastReveal = visible.body[0]
				return animate.call(this, nextElement, { reveal: true, pristine })
			} else {
				return animate.call(this, element)
			}
		}

		/**
		 * Assuming we have something visible on screen
		 * already, and we need to evaluate the element
		 * that was passed in...
		 *
		 * We first check if the element should reset.
		 */
		if (!element.visible && element.revealed && element.config.reset) {
			seq.lastReset = i
			return animate.call(this, element, { reset: true })
		}

		/**
		 * If our element isn’t resetting, we check the
		 * element sequence index against the head, and
		 * then the foot of the sequence.
		 */
		if (!seq.headblocked && i === [...revealed.head].pop() && i >= [...visible.body].shift()) {
			cue.call(this, seq, i, -1, pristine)
			seq.lastReveal = i
			return animate.call(this, element, { reveal: true, pristine })
		}

		if (!seq.footblocked && i === [...revealed.foot].shift() && i <= [...visible.body].pop()) {
			cue.call(this, seq, i, +1, pristine)
			seq.lastReveal = i
			return animate.call(this, element, { reveal: true, pristine })
		}
	}
}

export function Sequence (interval) {
	if (typeof interval === 'number') {
		if (interval >= 16) {
			/**
			 * Instance details.
			 */
			this.id = nextUniqueId()
			this.interval = interval
			this.members = []

			/**
			 * Flow control for sequencing animations.
			 */
			this.headblocked = true
			this.footblocked = true

			/**
			 * The last successful member indexes,
			 * and a container for DOM models.
			 */
			this.lastReveal = null
			this.lastReset = null
			this.models = {}
		} else {
			throw new RangeError('Sequence interval must be at least 16ms.')
		}
	} else {
		return null
	}
}

export function SequenceModel (prop, sequence, store) {
	this.head = [] // Elements before the body with a falsey prop.
	this.body = [] // Elements with a truthy prop.
	this.foot = [] // Elements after the body with a falsey prop.

	each(sequence.members, (id, index) => {
		const element = store.elements[id]
		if (element && element[prop]) {
			this.body.push(index)
		}
	})

	if (this.body.length) {
		each(sequence.members, (id, index) => {
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

function cue (seq, i, direction, pristine) {
	const blocked = ['headblocked', null, 'footblocked'][1 + direction]
	const nextId = seq.members[i + direction]
	const nextElement = this.store.elements[nextId]

	seq[blocked] = true

	setTimeout(() => {
		seq[blocked] = false
		if (nextElement) {
			sequence.call(this, nextElement, pristine)
		}
	}, seq.interval)
}
