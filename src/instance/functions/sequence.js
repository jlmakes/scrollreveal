import animate from './animate'
import each from '../../utils/each'
import nextUniqueId from '../../utils/next-unique-id'

export default function sequence(element, pristine = this.pristine) {
	const seq = this.store.sequences[element.sequence.id]
	const i = element.sequence.index

	if (seq) {
		const visible = new SequenceModel(seq, 'visible', this.store)
		const revealed = new SequenceModel(seq, 'revealed', this.store)

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
				return animate.call(this, nextElement, { reveal: true, pristine })
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
			return animate.call(this, element, { reset: true })
		}

		/**
		 * If our element isn’t resetting, we check the
		 * element sequence index against the head, and
		 * then the foot of the sequence.
		 */
		if (
			!seq.blocked.head &&
			i === [...revealed.head].pop() &&
			i >= [...visible.body].shift()
		) {
			cue.call(this, seq, i, -1, pristine)
			return animate.call(this, element, { reveal: true, pristine })
		}

		if (
			!seq.blocked.foot &&
			i === [...revealed.foot].shift() &&
			i <= [...visible.body].pop()
		) {
			cue.call(this, seq, i, +1, pristine)
			return animate.call(this, element, { reveal: true, pristine })
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

function cue(seq, i, direction, pristine) {
	const blocked = ['head', null, 'foot'][1 + direction]
	const nextId = seq.members[i + direction]
	const nextElement = this.store.elements[nextId]

	seq.blocked[blocked] = true

	setTimeout(() => {
		seq.blocked[blocked] = false
		if (nextElement) {
			sequence.call(this, nextElement, pristine)
		}
	}, seq.interval)
}
