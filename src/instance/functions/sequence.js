import animate from './animate'
import { each } from '../../utils/generic'


export default function sequence (element) {
	const seq = this.store.sequences[element.sequence.id]
	const i = element.sequence.index

	if (seq) {
		const visible = modelSequenceByProp.call(this, seq, 'visible')
		const revealed = modelSequenceByProp.call(this, seq, 'revealed')

		/**
		 * First run is a special case, and
		 * kicks off two recursive calls.
		 */
		if (!revealed.body.length && i === [...visible.body].shift()) {
			cue.call(this, seq, i, -1)
			cue.call(this, seq, i, 1)
		} else if (seq.headroom && i === [...revealed.head].pop()) {
			cue.call(this, seq, i, -1)
		} else if (seq.footroom && i === [...revealed.foot].shift()) {
			cue.call(this, seq, i, 1)
		} else return

		animate.call(this, element, true)
	}
}


function cue (seq, last, tilt) {
	const nextId = seq.members[last + tilt]
	const nextSpace = ['headroom', null, 'footroom'][1 + tilt]
	const nextElement = this.store.elements[nextId]

	seq[nextSpace] = false

	setTimeout(() => {
		seq[nextSpace] = true
		if (nextElement) {
			sequence.call(this, nextElement)
		}
	}, seq.interval)
}


function modelSequenceByProp (sequence, prop) {
	const model = {
		head: [], // Elements before the body with a falsey prop.
		body: [], // Elements with a truthy prop.
		foot: [], // Elements after the body with a falsey prop.
	}

	each(sequence.members, (id, index) => {
		const element = this.store.elements[id]
		if (element[prop]) {
			model.body.push(index)
		}
	})

	if (model.body.length) {
		each(sequence.members, (id, index) => {
			const element = this.store.elements[id]
			if (!element[prop]) {
				index < model.body[0]
					? model.head.push(index)
					: model.foot.push(index)
			}
		})
	}

	return model
}
