import animate from './animate'
import { each } from '../../utils/generic'


export default function sequence (element) {
	const sequence = this.store.sequences[element.sequence.id]

	if (sequence) {
		const visible = modelSequenceByProp.call(this, sequence, 'visible')
		const revealed = modelSequenceByProp.call(this, sequence, 'revealed')

		// console.clear()
		// console.log(visible)
		// console.log(revealed)

		/**
		 * Until more complex logic is implemented...
		 */
		animate.call(this, element)
	}

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
