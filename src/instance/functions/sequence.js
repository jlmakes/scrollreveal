import animate from './animate'
import { each } from '../../utils/generic'


export default function sequence (element) {
	const seq = this.store.sequences[element.sequence.id]
	const i = element.sequence.index

	if (seq) {
		const visible = modelSequenceByProp.call(this, seq, 'visible')
		const revealed = modelSequenceByProp.call(this, seq, 'revealed')

		if (!revealed.body.length && i === [...visible.body].shift()) {
			cue.call(this, seq, i, -1)
			cue.call(this, seq, i, +1)
		} else if (!seq.headblocked && i === [...revealed.head].pop() && i >= [...visible.body].shift()) {
			cue.call(this, seq, i, -1)
		} else if (!seq.footblocked && i === [...revealed.foot].shift() && i <= [...visible.body].pop()) {
			cue.call(this, seq, i, +1)
		} else if (!element.visible && element.revealed && element.config.reset) {
			return animate.call(this, element, undefined, true)
		} else return

		animate.call(this, element, true)
	}
}


function cue (seq, i, charge) {
	const blocked = ['headblocked', null, 'footblocked'][1 + charge]
	const nextId = seq.members[i + charge]
	const nextElement = this.store.elements[nextId]

	seq[blocked] = true

	setTimeout(() => {
		seq[blocked] = false
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
